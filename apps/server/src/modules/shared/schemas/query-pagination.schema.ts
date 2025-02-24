import { z } from "zod";

/**
 * Schema for query pagination parameters.
 *
 * This schema validates and provides default values for pagination-related query parameters.
 *
 * @property {string} page - The page number for pagination. Must be a string representing a positive integer. Defaults to "1".
 * @property {string} limit - The number of items per page. Must be a string representing a positive integer. Defaults to "8".
 * @property {("createdAt" | "updatedAt")} sortBy - The field by which to sort the results. Can be either "createdAt" or "updatedAt". Defaults to "createdAt".
 * @property {("desc" | "asc")} order - The order in which to sort the results. Can be either "desc" for descending or "asc" for ascending. Defaults to "desc".
 */
export const querypaginationSchema = z
  .object({
    page: z.string().regex(/^\d+$/).optional().default("1"),
    limit: z.string().regex(/^\d+$/).optional().default("8"),
    sortBy: z.enum(["createdAt", "updatedAt"]).optional().default("createdAt"),
    order: z.enum(["desc", "asc"]).optional().default("desc"),
  })
  .strict();
