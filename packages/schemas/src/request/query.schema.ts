import { z } from "zod";

/**
 * Schema for pagination query parameters.
 *
 * This schema validates and provides default values for pagination-related query parameters.
 *
 * @property {string} page - The page number for pagination. Must be a string representing a positive integer. Defaults to "1".
 * @property {string} limit - The number of items per page. Must be a string representing a positive integer. Defaults to "8".
 * @property {("createdAt" | "updatedAt")} sortBy - The field by which to sort the results. Can be either "createdAt" or "updatedAt". Defaults to "createdAt".
 * @property {("desc" | "asc")} order - The order in which to sort the results. Can be either "desc" for descending or "asc" for ascending. Defaults to "desc".
 */
export const paginationQuerySchema = z
  .object({
    page: z.string().regex(/^\d+$/).optional().default("1"),
    limit: z.string().regex(/^\d+$/).optional().default("8"),
    sortBy: z.enum(["createdAt", "updatedAt"]).optional().default("createdAt"),
    order: z.enum(["desc", "asc"]).optional().default("desc"),
  })
  .strict();

/**
 * Schema for pagination and search query parameters.
 * This schema extends the pagination query schema to include a search query parameter.
 * @property {string} page - The page number for pagination. Must be a string representing a positive integer. Defaults to "1".
 * @property {string} limit - The number of items per page. Must be a string representing a positive integer. Defaults to "8".
 * @property {("createdAt" | "updatedAt")} sortBy - The field by which to sort the results. Can be either "createdAt" or "updatedAt". Defaults to "createdAt".
 * @property {("desc" | "asc")} order - The order in which to sort the results. Can be either "desc" for descending or "asc" for ascending. Defaults to "desc".
 * @property {string} q - The search query string. Must be a string with a minimum length of 2 and a maximum length of 100 characters.
 */
export const searchAndPaginationQuerySchema = z
  .object({
    page: z.string().regex(/^\d+$/).optional().default("1"),
    limit: z.string().regex(/^\d+$/).optional().default("8"),
    sortBy: z.enum(["createdAt", "updatedAt"]).optional().default("createdAt"),
    order: z.enum(["desc", "asc"]).optional().default("desc"),
    q: z.string().min(1).max(100),
  })
  .strict();
