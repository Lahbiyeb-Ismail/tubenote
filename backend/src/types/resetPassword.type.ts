import type { z } from 'zod';
import type {
  forgotPasswordBodySchema,
  passwordResetBodySchema,
} from '../schemas/resetPassword.schema';

export type ForgotPasswordBody = z.infer<typeof forgotPasswordBodySchema.body>;

export type ResetPasswordBody = z.infer<typeof passwordResetBodySchema.body>;
