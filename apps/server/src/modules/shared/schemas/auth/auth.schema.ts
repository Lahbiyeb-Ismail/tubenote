import { z } from "zod";

import {
  emailSchema,
  passwordSchema,
  usernameSchema,
} from "@/common/schemas/user";

/**
 * Schema for user registration.
 *
 * This schema validates the following fields:
 * - `username`: Must adhere to the `usernameSchema`.
 * - `email`: Must adhere to the `emailSchema`.
 * - `password`: Must adhere to the `passwordSchema`.
 */
export const registerSchema = z
  .object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
  })
  .strict();

/**
 * Schema for user login.
 *
 * This schema validates the structure of the login request object.
 * It ensures that the `email` and `password` fields are present and conform to their respective schemas.
 *
 * @constant
 * @property {ZodSchema} email - The schema for validating the email field.
 * @property {ZodSchema} password - The schema for validating the password field.
 */
export const loginSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
  })
  .strict();
