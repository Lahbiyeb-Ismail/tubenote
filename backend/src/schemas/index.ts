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
    noteContent: z.string(),
    videoTitle: z.string(),
    videoThumbnail: z.string().url(),
    userId: z.string(),
    videoId: z.string(),
  }),
};

export const userSchema = {
  body: z.object({
    kindeId: z.string(),
    username: z.string(),
    email: z.string().email(),
  }),
};
