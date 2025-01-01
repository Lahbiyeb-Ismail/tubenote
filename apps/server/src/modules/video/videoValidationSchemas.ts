import { z } from "zod";

export const createVideoBodySchema = z.object({
  videoId: z.string().min(4),
});

export const videoIdParamSchema = z.object({
  youtubeId: z.string().min(4),
});
