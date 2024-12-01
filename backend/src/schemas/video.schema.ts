import { z } from 'zod';

export const createVideoBodySchema = {
  body: z.object({
    videoId: z.string().min(4),
  }),
};
