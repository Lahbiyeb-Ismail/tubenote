import { z } from "zod";

export const emailBodySchema = z.object({
  email: z.string().email(),
});
