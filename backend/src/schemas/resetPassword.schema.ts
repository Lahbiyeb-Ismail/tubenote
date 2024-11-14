import { z } from 'zod';

export const resetPasswordSchema = {
  body: z.object({
    email: z.string().email({ message: 'Invalid email address.' }),
  }),
};
