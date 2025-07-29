/**
 * Data Transfer Object (DTO) for pagination query parameters.
 *
 * @interface QueryPaginationDto
 *
 * @property {string} [page] - The page number for pagination.
 * @property {string} [limit] - The number of items per page.
 * @property {string} [sortBy] - The field by which to sort the results.
 * @property {string} [order] - The order of sorting (e.g., 'asc' for ascending, 'desc' for descending).
 */
export interface IPaginationQueryDto {
  page: string;
  limit: string;
  sortBy: string;
  order: string;
}

/**
 * Query DTO interface that combines search functionality with pagination.
 * Extends the base pagination query DTO to include search query parameter.
 *
 * @interface ISearchAndPaginationQueryDto
 * @extends IPaginationQueryDto
 *
 * @property {string} q - The search query string used to filter results
 */
export interface ISearchAndPaginationQueryDto extends IPaginationQueryDto {
  q: string;
}
