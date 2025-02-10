import { z } from "zod";

export const createNoteSchema = z
  .object({
    title: z
      .string()
      .min(3, { message: "Title must be at least 3 characters long." }),
    content: z
      .string()
      .min(10, { message: "Content must be at least 10 characters long." }),
    videoTitle: z
      .string()
      .min(3, { message: "Video title must be at least 3 characters long." }),
    thumbnail: z
      .string()
      .min(3, { message: "Thumbnail must be at least 3 characters long." }),
    videoId: z
      .string()
      .min(3, { message: "Video id must be at least 3 characters long." }),
    youtubeId: z
      .string()
      .min(3, { message: "Youtube id must be at least 3 characters long." }),
    timestamp: z.number(),
  })
  .strict();
