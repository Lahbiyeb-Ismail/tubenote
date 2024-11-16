import { z } from 'zod';

export const sendResetPasswordEmailSchema = {
  body: z.object({
    email: z.string().email({ message: 'Invalid email address.' }),
  }),
};
