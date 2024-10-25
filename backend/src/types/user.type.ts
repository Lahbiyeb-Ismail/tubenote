import type { z } from 'zod';

import type {
  updatePasswordSchema,
  updateUserSchema,
} from '../schemas/user.schema';

export type UpdateUserBody = z.infer<typeof updateUserSchema.body>;

export type UpdatePasswordBody = z.infer<typeof updatePasswordSchema.body>;
