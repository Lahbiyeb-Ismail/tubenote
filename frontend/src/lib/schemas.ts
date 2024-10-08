import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

export const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters long.' }),
  email: z.string().email('Invalid email address.'),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 8 characters.' }),
});

export const videoFormSchema = z.object({
  videoUrl: z.string().url('Invalid URL.'),
});
