import { z } from "zod";

/**
 * Schema for OAuth code validation.
 *
 * This schema validates that the `code` field is a string.
 */
export const oauthCodeSchema = z
  .object({
    code: z.string().min(8),
  })
  .strict();
