import { z } from "zod";

export const searchFormSchema = z.object({
  videoUrl: z
    .string()
    .url({
      message: "Invalid youtube URL. Please provide a valid youtube video URL.",
    })
    .includes("youtube.com/watch?v=", {
      message: "Invalid youtube URL. Please provide a valid youtube video URL.",
    }),
});
