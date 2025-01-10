import { z } from "zod";

export const tokenParamSchema = z.object({
  token: z.string().min(4),
});
