/**
 * Data Transfer Object (DTO) for query pagination parameters.
 *
 * @interface QueryPaginationDto
 *
 * @property {string} [page] - The page number for pagination.
 * @property {string} [limit] - The number of items per page.
 * @property {string} [sortBy] - The field by which to sort the results.
 * @property {string} [order] - The order of sorting (e.g., 'asc' for ascending, 'desc' for descending).
 */
export interface IQueryPaginationDto {
  page?: string;
  limit?: number;
  sortBy?: string;
  order?: string;
}
