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

export const noteTitleFormSchema = z.object({
  noteTitle: z
    .string({
      message: "Note title is required. Please enter a title.",
    })
    .min(3, {
      message: "Note title must be at least 3 characters long.",
    }),
});
