import { z } from "zod";

/**
 * Schema for validating request parameters that include a token.
 *
 * This schema ensures that the `token` parameter is a string with a minimum length of 4 characters.
 *
 * @example
 * // Valid token parameter
 * const validToken = { token: "abcd" };
 *
 * // Invalid token parameter (too short)
 * const invalidToken = { token: "abc" };
 */
export const tokenParamSchema = z.object({
  token: z.string().min(4),
});

/**
 * Schema for validating an ID parameter.
 *
 * This schema ensures that the `id` parameter is a string with a minimum length of 4 characters.
 *
 * @example
 * const validId = { id: "abcd" }; // Passes validation
 * const invalidId = { id: "abc" }; // Fails validation
 */
export const idParamSchema = z.object({
  id: z.string().min(4),
});
