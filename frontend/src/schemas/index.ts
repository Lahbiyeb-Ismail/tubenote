import { z } from "zod";

export const searchFormSchema = z.object({
  videoUrl: z
    .string()
    .url({ message: "Invalid URL. Please provide a valid youtube video URL." }),
});
