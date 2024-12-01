import { z } from 'zod';

export const noteSchema = {
  body: z.object({
    title: z
      .string()
      .min(3, { message: 'Title must be at least 3 characters long.' }),
    content: z
      .string()
      .min(10, { message: 'Content must be at least 10 characters long.' }),
    videoTitle: z.string(),
    thumbnail: z.string(),
    videoId: z.string(),
    youtubeId: z.string(),
    timestamp: z.number(),
  }),
};

export const noteIdParamSchema = {
  params: z.object({
    noteId: z.string(),
  }),
};
