import type {
  IFindAllDto,
  IPaginatedData,
  IQueryPaginationDto,
} from "@/modules/shared/dtos";

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

export interface GetPaginationQueriesOptions {
  reqQuery: IQueryPaginationDto;
  itemsPerPage: number;
}

/**
 * Options to customize the API response.
 */
export interface ApiResponseOptions<T> {
  data?: T;
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
export interface ApiResponse<T> extends ApiResponseOptions<T> {
  success: boolean;
}

export interface IResponseFormatter {
  formatResponse<T>(options?: ApiResponseOptions<T>): ApiResponse<T>;
  formatPaginatedResponse<T>(
    paginationQuery: IQueryPaginationDto,
    paginatedData: IPaginatedData<T>
  ): ApiResponse<T[]>;
  getPaginationQueries(
    options: GetPaginationQueriesOptions
  ): Omit<IFindAllDto, "userId">;
}
