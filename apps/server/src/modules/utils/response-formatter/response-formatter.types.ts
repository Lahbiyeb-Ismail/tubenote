import type { FindManyDto } from "@/common/dtos/find-many.dto";
import type { QueryPaginationDto } from "@/common/dtos/query-pagination.dto";

export interface IResponseFormatter {
  formatResponse<T>(data: T, options?: ApiResponseOptions): ApiResponse<T>;
  formatPaginatedResponse<T>(
    paginationQuery: QueryPaginationDto,
    result: PaginatedResult<T>
  ): ApiResponse<T[]>;
  getPaginationQueries(
    queries: QueryPaginationDto,
    defaultLimit: number
  ): Omit<FindManyDto, "userId">;
}

/**
 * Interface representing the pagination metadata.
 */
export interface PaginationInfo {
  totalPages: number;
  currentPage: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Generic interface representing a paginated result.
 */
export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
}

/**
 * Options to customize the API response.
 */
export interface ApiResponseOptions {
  status?: number;
  message?: string;
  pagination?: PaginationInfo;
}

/**
 * Represents a standardized API response.
 *
 * @template T - The type of the data being returned in the response.
 * @extends ApiResponseOptions
 *
 * @property {boolean} success - Indicates whether the API request was successful.
 * @property {T} data - The data returned by the API.
 */
export interface ApiResponse<T> extends ApiResponseOptions {
  success: boolean;
  data: T;
}
