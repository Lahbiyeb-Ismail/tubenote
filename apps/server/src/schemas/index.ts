import { z } from "zod";

export const paginationQuerySchema = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("8"),
});
