import type { z } from 'zod';

import type { registrationSchema } from '../schemas/auth.schema';

export type RegisterCredentiels = z.infer<typeof registrationSchema.body>;
