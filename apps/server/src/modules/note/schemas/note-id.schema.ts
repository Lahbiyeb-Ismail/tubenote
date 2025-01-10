import { z } from "zod";

export const noteIdSchema = z.object({
  noteId: z.string(),
});
