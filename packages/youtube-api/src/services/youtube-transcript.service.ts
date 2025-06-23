import { BadRequestError, ERROR_NAMES, InternalServerError, NotFoundError } from "@tubenote/api-errors";
import fs from "node:fs/promises";
import path from "node:path";

import type { TranscriptRequest, TranscriptResponse } from "../types";

import { envConfig } from "../env.config";
import { validateLanguageCode, validateTimeFormat } from "../utils/validators";
import { PythonExecutor } from "./python-executor.service";

/**
 * Service responsible for fetching and processing YouTube video transcripts.
 * Uses a Python executor to run transcript extraction scripts.
 */
export class YoutubeTranscriptService {
  private pythonExecutor: PythonExecutor;

  /**
   * Initializes a new instance of the YoutubeTranscriptService.
   * Sets up the Python executor using the configured Python executable path.
   */
  constructor() {
    this.pythonExecutor = new PythonExecutor(envConfig.python.executable);
  }

  /**
   * Retrieves and processes a transcript for a YouTube video.
   *
   * @param request - The transcript request containing YouTube video ID and optional parameters
   * @returns A promise resolving to a TranscriptResponse containing the transcript data
   * @throws {BadRequestError} When input parameters are invalid
   * @throws {NotFoundError} When transcript is not available or disabled
   * @throws {InternalServerError} When an unexpected error occurs during processing
   *
   * The method performs the following steps:
   * 1. Validates the input parameters
   * 2. Builds command line arguments for the Python script
   * 3. Executes the Python script to extract transcript data
   * 4. Processes and formats the output
   * 5. Cleans up temporary files
   */
  async getTranscript(request: TranscriptRequest): Promise<TranscriptResponse> {
    try {
      // Validate and extract video ID
      const ytVideoId = request.ytVideoId;
      if (!ytVideoId) {
        throw new BadRequestError("Invalid YouTube video ID or URL", ERROR_NAMES.INVALID_VIDEO_ID);
      }

      // Validate optional parameters
      if (request.language && !validateLanguageCode(request.language)) {
        throw new BadRequestError("Invalid language code", ERROR_NAMES.INVALID_LANGUAGE);
      }

      if (request.startTime && !validateTimeFormat(request.startTime)) {
        throw new BadRequestError("Invalid start time format", ERROR_NAMES.INVALID_TIME_FORMAT);
      }

      if (request.endTime && !validateTimeFormat(request.endTime)) {
        throw new BadRequestError("Invalid end time format", ERROR_NAMES.INVALID_TIME_FORMAT);
      }

      // Build Python script arguments
      const args = [ytVideoId];

      if (request.language) {
        args.push("-l", request.language);
      }

      if (request.format) {
        args.push("-f", request.format);
      }

      if (request.timestamps) {
        args.push("-t");
      }

      if (request.startTime) {
        args.push("-s", request.startTime);
      }

      if (request.endTime) {
        args.push("-e", request.endTime);
      }

      // Set output file
      const outputFile = path.join("/tmp", `${ytVideoId}_${Date.now()}.${request.format === "json" ? "json" : "txt"}`);
      args.push("-o", outputFile);

      // Execute Python script
      const result = await this.pythonExecutor.executeScript(args);

      if (!result.success) {
        // Parse error messages
        const errorMessage = result.error || "Unknown error";

        if (errorMessage.includes("Subtitles are disabled")) {
          throw new NotFoundError("Subtitles are disabled for this video", ERROR_NAMES.TRANSCRIPTS_DISABLED);
        }

        if (errorMessage.includes("No transcript available")) {
          throw new NotFoundError("No transcript available for the requested language", ERROR_NAMES.TRANSCRIPT_NOT_FOUND);
        }

        if (errorMessage.includes("Video is unavailable")) {
          throw new NotFoundError("Video is unavailable or private", ERROR_NAMES.VIDEO_UNAVAILABLE);
        }

        throw new InternalServerError("Failed to retrieve transcript");
      }

      // Read the generated file
      const transcriptContent = await fs.readFile(outputFile, "utf-8");

      // Clean up temporary file
      try {
        await fs.unlink(outputFile);
      }
      catch (cleanupError) {
        console.warn("Failed to clean up temporary file:", cleanupError);
      }

      // Parse entry count from output
      const entryCountMatch = result.output?.match(/Entries: (\d+)/);
      const entryCount = entryCountMatch ? Number.parseInt(entryCountMatch[1]) : 0;

      // Parse time range from output
      const timeRangeMatch = result.output?.match(/Time range: ([^-]+) - (.+)/);
      const timeRange = timeRangeMatch
        ? {
            start: timeRangeMatch[1].trim(),
            end: timeRangeMatch[2].trim(),
          }
        : undefined;

      return {
        success: true,
        data: {
          ytVideoId,
          transcript: transcriptContent,
          format: request.format || "text",
          language: request.language,
          timestamps: request.timestamps || false,
          entryCount,
          timeRange,
        },
      };
    }
    catch (error) {
      if (error instanceof Error && "statusCode" in error) {
        throw error;
      }

      throw new InternalServerError("Internal server error");
    }
  }
}
