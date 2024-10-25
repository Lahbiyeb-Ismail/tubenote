import type { z } from 'zod';

import type { loginSchema, registrationSchema } from '../schemas/auth.schema';

export type RegisterCredentiels = z.infer<typeof registrationSchema.body>;

export type LoginCredentials = z.infer<typeof loginSchema.body>;
