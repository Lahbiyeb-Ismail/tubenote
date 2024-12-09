import type {
  forgotPasswordBodySchema,
  resetPasswordBodySchema,
  resetPasswordParamsSchema,
} from "../schemas/resetPassword.schema";

export type ForgotPasswordBody = typeof forgotPasswordBodySchema;

export type ResetPasswordBody = typeof resetPasswordBodySchema;

export type ResetPasswordParams = typeof resetPasswordParamsSchema;
