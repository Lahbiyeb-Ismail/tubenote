import { z } from 'zod';

export const updateUserSchema = {
  body: z.object({
    username: z
      .string()
      .min(2, { message: 'Username must be at least 3 characters long.' })
      .max(50, { message: 'Username must be at most 50 characters long.' }),
    email: z
      .string()
      .email({ message: 'Invalid email address. Please try another one.' }),
  }),
};

export const updatePasswordSchema = {
  body: z.object({
    currentPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' }),
    newPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' }),
  }),
};
