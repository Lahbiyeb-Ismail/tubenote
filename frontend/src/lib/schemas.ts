import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long.' }),
});

export const registerFormSchema = z.object({
  username: z.string().min(3, { message: 'Name must be at least 3 characters long.' }),
  email: z.string().email('Invalid email address.'),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long.' }),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

export type RegisterFormData = z.infer<typeof registerFormSchema>;
