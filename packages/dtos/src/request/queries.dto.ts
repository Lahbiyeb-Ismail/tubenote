/**
 * Data Transfer Object (DTO) for pagination query parameters.
 *
 * @interface QueryPaginationDto
 *
 * @property {number} [page] - The page number for pagination.
 * @property {number} [limit] - The number of items per page.
 * @property {string} [sortBy] - The field by which to sort the results.
 * @property {string} [order] - The order of sorting (e.g., 'asc' for ascending, 'desc' for descending).
 */
export interface IPaginationQueryDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: string;
}
