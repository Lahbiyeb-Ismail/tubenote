import { z } from "zod";

/**
 * Schema for validating the input when creating a new note.
 *
 * This schema enforces the following rules:
 * - **title**: Must be a string with a minimum length of 3 characters.
 * - **content**: Must be a string with a minimum length of 10 characters.
 * - **videoTitle**: Must be a string with a minimum length of 3 characters.
 * - **thumbnail**: Must be a string with a minimum length of 3 characters.
 * - **youtubeId**: Must be a string with a minimum length of 3 characters.
 * - **tags**: Optional array of strings (min length 3), defaults to `[]` if not provided.
 * - **category**: Optional string (min length 3), defaults to `null` if not provided.
 * - **isPublic**: Optional boolean that defaults to `false`.
 * - **timestamp**: Object containing `start` and `end` numbers (both ≥ 0).
 *
 * The `.strict()` method is used to ensure that no additional properties are allowed.
 */
export const createNoteSchema = z
  .object({
    title: z
      .string()
      .min(3, { message: "Title must be at least 3 characters long." }),
    content: z
      .string()
      .min(10, { message: "Content must be at least 10 characters long." }),
    videoTitle: z
      .string()
      .min(3, { message: "Video title must be at least 3 characters long." }),
    thumbnail: z
      .string()
      .min(3, { message: "Thumbnail must be at least 3 characters long." }),
    youtubeId: z
      .string()
      .min(3, { message: "Youtube id must be at least 3 characters long." }),
    tags: z
      .array(
        z.string().min(3, { message: "Each tag must be at least 3 characters long." }),
      )
      .optional()
      .default([]),
    category: z
      .string()
      .optional()
      .nullable()
      .default(null),
    isPublic: z.boolean().optional().default(false),
    timestamp: z.object({
      start: z
        .number()
        .min(0, { message: "Start time must be a positive number." }),
      end: z
        .number()
        .min(0, { message: "End time must be a positive number." }),
    }),
  })
  .strict();
