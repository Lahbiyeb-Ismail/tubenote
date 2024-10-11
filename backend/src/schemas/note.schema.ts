import { z } from 'zod';

export const noteSchema = {
  body: z.object({
    title: z
      .string()
      .min(3, { message: 'Title must be at least 3 characters long.' }),
    content: z
      .string()
      .min(10, { message: 'Content must be at least 10 characters long.' }),
    videoTile: z.string(),
    thumbnail: z.string(),
    videoId: z.string(),
  }),
};
