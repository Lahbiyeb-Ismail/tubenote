import { z } from "zod";

export const oauthCodeSchema = z.object({
  code: z.string(),
});
