import { z } from "zod";

import { emailSchema, passwordSchema } from "@modules/shared";

/**
 * Schema for validating the body of a request containing an email.
 *
 * This schema ensures that the request body includes a valid email
 * as defined by the `emailSchema`.
 */
export const emailBodySchema = z.object({
  email: emailSchema,
});

/**
 * Schema for validating the request body containing a password.
 *
 * This schema ensures that the request body includes a valid password
 * as defined by the `passwordSchema`.
 */
export const passwordBodySchema = z.object({
  password: passwordSchema,
});
