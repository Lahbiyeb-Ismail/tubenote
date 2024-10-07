import { z } from 'zod';

export const registrationSchema = {
  body: z.object({
    username: z
      .string()
      .min(3, { message: 'Username must be at least 3 characters long.' }),
    email: z.string().email({ message: 'Invalid email address.' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' }),
  }),
};

export const loginSchema = {
  body: z.object({
    email: z.string().email({ message: 'Invalid email address.' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' }),
  }),
};
