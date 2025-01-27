import { z } from "zod";

export const oauthTemporaryCodeSchema = z.object({
  code: z.string(),
});
