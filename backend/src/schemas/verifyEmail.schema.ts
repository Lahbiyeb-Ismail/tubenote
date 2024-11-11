import { z } from 'zod';

export const sendVerifyEmailSchema = {
  body: z.object({
    email: z.string().email({ message: 'Invalid email address.' }),
  }),
};

export const verifyEmailSchema = {
  params: z.object({
    token: z.string().min(1),
  }),
};
