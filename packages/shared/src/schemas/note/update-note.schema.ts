import { z } from "zod";

/**
 * Schema for validating the input when updating an existing note.
 *
 * This schema validates an object containing the fields to update for a note.
 * It enforces the following rules when the update object is provided:
 * - **title**: Must be a string with a minimum length of 3 characters.
 * - **content**: Must be a string with a minimum length of 10 characters.
 * - **timestamp**: Must be a number.
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
    timestamp: z.number().optional(),
  })
  .strict();
