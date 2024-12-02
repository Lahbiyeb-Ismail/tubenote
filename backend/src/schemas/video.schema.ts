import { z } from 'zod';

export const createVideoBodySchema = {
  body: z.object({
    videoId: z.string().min(4),
  }),
};

export const videoIdParamSchema = {
  params: z.object({
    videoId: z.string().min(4),
  }),
};
