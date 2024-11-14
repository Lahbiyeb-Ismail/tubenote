import type { z } from 'zod';
import type { resetPasswordSchema } from '../schemas/resetPassword.schema';

export type ResetPasswordBody = z.infer<typeof resetPasswordSchema.body>;
