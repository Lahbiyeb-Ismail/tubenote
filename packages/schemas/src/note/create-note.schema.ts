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
 * - **timestamp**: Must be a number.
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
    timestamp: z.number(),
  })
  .strict();
