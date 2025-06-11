import { z } from "zod";

import { passwordSchema } from "./password.schema";

/**
 * Schema for validating password update requests.
 *
 * This schema ensures that:
 * - The current password meets password requirements
 * - The new password meets password requirements
 * - The confirmation password meets password requirements
 * - The new password is different from the current password
 * - The confirmation password matches the new password
 *
 * @remarks
 * This schema uses Zod's refine method to add custom validation rules.
 */
export const updatePasswordSchema = z
  .object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .strict()
  .refine(data => data.currentPassword !== data.newPassword, {
    message: "New password must be different from the current password.",
    path: ["newPassword"],
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "New password and confirm password must match.",
    path: ["confirmPassword"],
  });
