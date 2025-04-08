import { z } from "zod";

export const videoIdParamSchema = z
  .object({
    videoId: z.string().min(4),
  })
  .strict();
