import { z } from "zod";

/**
 * Schema for validating an ID parameter.
 *
 * This schema ensures that the `id` parameter is a string with a minimum length of 4 characters.
 *
 * @example
 * const validId = { id: "abcd" }; // Passes validation
 * const invalidId = { id: "abc" }; // Fails validation
 */
export const paramIdSchema = z.object({
  id: z.string().min(4),
});
