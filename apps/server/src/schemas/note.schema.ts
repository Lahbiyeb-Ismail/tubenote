import { z } from "zod";

const timestampSchema = z.object({
  start: z.number(),
  end: z.number(),
});

export const noteBodySchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long." }),
  content: z
    .string()
    .min(10, { message: "Content must be at least 10 characters long." }),
  videoTitle: z.string(),
  thumbnail: z.string(),
  videoId: z.string(),
  youtubeId: z.string(),
  timestamp: timestampSchema,
});

export const noteIdParamSchema = z.object({
  noteId: z.string(),
});

export const updateNoteBodySchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long." }),
  content: z
    .string()
    .min(10, { message: "Content must be at least 10 characters long." }),
  timestamp: timestampSchema,
});
