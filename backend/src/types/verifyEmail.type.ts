import type { z } from 'zod';
import type { sendVerifyEmailSchema } from '../schemas/verifyEmail.schema';

export type SendVerifyEmail = z.infer<typeof sendVerifyEmailSchema.body>;
