import { z } from "zod";

export const paginationSchema = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("8"),
});
