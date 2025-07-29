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
 * Schema for search and pagination query parameters.
 *
 * @description Validates and transforms query parameters for search functionality with pagination support.
 * Includes validation for page number, limit, sorting options, and search query string.
 *
 * @property page - Page number as string, defaults to "1"
 * @property limit - Number of items per page as string, defaults to "9"
 * @property sortBy - Field to sort by, either "createdAt" or "updatedAt", defaults to "createdAt"
 * @property order - Sort order, either "desc" or "asc", defaults to "desc"
 * @property q - Search query string, max 100 characters, transforms "undefined" string to empty string
 *
 * @example
 * ```typescript
 * const result = searchAndPaginationQuerySchema.parse({
 *   page: "2",
 *   limit: "10",
 *   sortBy: "updatedAt",
 *   order: "asc",
 *   q: "search term"
 * });
 * ```
 */
export const searchAndPaginationQuerySchema = z
  .object({
    page: z.string().regex(/^\d+$/).optional().default("1"),
    limit: z.string().regex(/^\d+$/).optional().default("9"),
    sortBy: z.enum(["createdAt", "updatedAt"]).optional().default("createdAt"),
    order: z.enum(["desc", "asc"]).optional().default("desc"),
    q: z.string().max(100).transform(val => val === "undefined" ? "" : val),
  })
  .strict();
