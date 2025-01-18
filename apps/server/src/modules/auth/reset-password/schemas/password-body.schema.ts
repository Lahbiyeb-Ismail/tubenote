import { z } from "zod";

export const passwordBodySchema = z.object({
  password: z.string().min(8),
});
