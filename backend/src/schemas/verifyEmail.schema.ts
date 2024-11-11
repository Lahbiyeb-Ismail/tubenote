import { z } from 'zod';

export const sendVerifyEmailSchema = {
  body: z.object({
    email: z.string().email({ message: 'Invalid email address.' }),
  }),
};
