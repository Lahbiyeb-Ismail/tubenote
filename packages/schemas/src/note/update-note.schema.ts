import { z } from "zod";

/**
 * Schema for validating the input when updating an existing note.
 *
 * This schema validates an object containing the fields to update for a note.
 * It enforces the following rules when the update object is provided:
 * - **title**: Must be a string with a minimum length of 3 characters.
 * - **content**: Must be a string with a minimum length of 10 characters.
 * - **timestamp**: Must be a number.
 * - **tags**: Optional array of strings, each with a minimum length of 3 characters.
 * - **category**: Optional string that can be `null`, defaults to `null` if not provided.
 *
 * The `.strict()` method ensures that no additional properties are allowed in the object.
 */
export const updateNoteSchema = z
  .object({
    title: z
      .string()
      .min(3, { message: "Title must be at least 3 characters long." })
      .optional(),
    content: z
      .string()
      .min(10, { message: "Content must be at least 10 characters long." })
      .optional(),
    timestamp: z
      .object({
        start: z
          .number()
          .min(0, { message: "Start time must be a positive number." }),
        end: z
          .number()
          .min(0, { message: "End time must be a positive number." }),
      })
      .optional(),
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
  })
  .strict();
