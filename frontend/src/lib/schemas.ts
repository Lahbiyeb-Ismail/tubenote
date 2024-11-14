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
  videoUrl: z
    .string()
    .url({
      message: 'Invalid youtube URL. Please provide a valid youtube video URL.',
    })
    .includes('youtube.com/watch?v=', {
      message: 'Invalid youtube URL. Please provide a valid youtube video URL.',
    }),
});

export const saveNoteFormSchema = z.object({
  noteTitle: z
    .string({
      message: 'Note title is required. Please enter a title.',
    })
    .min(3, {
      message: 'Note title must be at least 3 characters long.',
    }),
});

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: 'Password must be at least 3 characters.',
    })
    .max(20, { message: 'Username must be less than 20 characters.' }),
  email: z
    .string()
    .email({ message: 'Invalid email address. Please try another one.' }),
});

export const updatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters.' }),
    newPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters.' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters.' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});
