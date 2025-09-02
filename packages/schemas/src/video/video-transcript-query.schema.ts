import { z } from "zod";

/**
 * Schema for video transcript request validation.
 *
 * @description Validates the request parameters for retrieving video transcripts from YouTube videos.
 *
 * @property ytVideoId - YouTube video ID, minimum 4 characters required
 * @property language - Language code for transcript (optional, defaults to "en"), minimum 2 characters
 * @property format - Output format for the transcript (optional, defaults to "text")
 * @property startTime - Start time for transcript segment (optional), minimum 5 characters
 * @property endTime - End time for transcript segment (optional), minimum 5 characters
 * @property timestamps - Whether to include timestamps in the output (optional, defaults to false)
 *
 * @example
 * ```typescript
 * const request = {
 *   ytVideoId: "dQw4w9WgXcQ",
 *   language: "en",
 *   format: "json",
 *   startTime: "00:30",
 *   endTime: "01:45",
 *   timestamps: true
 * };
 * ```
 */
export const videoTranscriptQuerySchema = z
  .object({
    ytVideoId: z.string().min(4),
    language: z.string().min(2).optional().default("en"),
    format: z.enum(["text", "json"]).optional().default("text"),
    startTime: z.string().min(1).optional(),
    endTime: z.string().min(1).optional(),
    timestamps: z.boolean().optional().default(false),
  })
  .strict();
