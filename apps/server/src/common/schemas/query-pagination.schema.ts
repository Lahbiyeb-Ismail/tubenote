import { z } from "zod";

export const paginationSchema = z
  .object({
    page: z.string().regex(/^\d+$/).optional().default("1"),
    limit: z.string().regex(/^\d+$/).optional().default("8"),
    sortBy: z.enum(["createdAt", "updatedAt"]).optional().default("createdAt"),
    order: z.enum(["desc", "asc"]).optional().default("desc"),
  })
  .strict();
