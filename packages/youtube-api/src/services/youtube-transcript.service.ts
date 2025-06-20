import fs from "node:fs/promises";
import path from "node:path";

import type { TranscriptRequest, TranscriptResponse } from "../types";

import { envConfig } from "../env.config";
import { validateLanguageCode, validateTimeFormat } from "../utils/validators";
import { PythonExecutor } from "./python-executor.service";

export class TranscriptService {
  private pythonExecutor: PythonExecutor;

  constructor() {
    this.pythonExecutor = new PythonExecutor(envConfig.python.executable);
  }

  async getTranscript(request: TranscriptRequest): Promise<TranscriptResponse> {
    try {
      // Validate and extract video ID
      const ytVideoId = request.ytVideoId;
      if (!ytVideoId) {
        throw new Error("Invalid YouTube video ID or URL");
      }

      // Validate optional parameters
      if (request.language && !validateLanguageCode(request.language)) {
        throw new Error("Invalid language code");
      }

      if (request.startTime && !validateTimeFormat(request.startTime)) {
        throw new Error("Invalid start time format");
      }

      if (request.endTime && !validateTimeFormat(request.endTime)) {
        throw new Error("Invalid end time format");
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
          throw new Error("Subtitles are disabled for this video");
        }

        if (errorMessage.includes("No transcript available")) {
          throw new Error("No transcript available for the requested language");
        }

        if (errorMessage.includes("Video is unavailable")) {
          throw new Error("Video is unavailable or private");
        }

        throw new Error("Failed to retrieve transcript");
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

      throw new Error("Internal server error");
    }
  }
}
