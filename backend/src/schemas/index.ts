import { z } from 'zod';

export const signupSchema = {
  body: z.object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
  }),
};

export const loginSchema = {
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
};

export const noteSchema = {
  body: z.object({
    videoId: z.string(),
    title: z.string(),
    content: z.string(),
  }),
};
