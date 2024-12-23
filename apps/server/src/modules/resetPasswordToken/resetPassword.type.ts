import type {
  forgotPasswordBodySchema,
  resetPasswordBodySchema,
  resetPasswordParamsSchema,
} from "./resetPasswordValidationSchemas";

export type ForgotPasswordBody = typeof forgotPasswordBodySchema;

export type ResetPasswordBody = typeof resetPasswordBodySchema;

export type ResetPasswordParams = typeof resetPasswordParamsSchema;

export interface ResetTokenEntry {
  token: string;
  id: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}
