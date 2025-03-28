import type {
  IFindAllDto,
  IPaginatedData,
  IQueryPaginationDto,
} from "@/modules/shared/dtos";

/**
 * Interface representing the pagination metadata.
 */
export interface IPaginationInfo {
  totalPages: number;
  currentPage: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface IGetPaginationQueriesOptions {
  reqQuery: IQueryPaginationDto;
  itemsPerPage: number;
}

/**
 * Options to customize the API response.
 */
export interface IResponseOptions<T> {
  status: number;
  message: string;
  data?: T;
  pagination?: IPaginationInfo;
}

/**
 * Represents a standardized API response.
 *
 * @template T - The type of the data being returned in the response.
 * @extends IResponseOptions
 *
 * @property {boolean} success - Indicates whether the API request was successful.
 * @property {T} data - The data returned by the API.
 */
export interface IApiResponse<T> extends IResponseOptions<T> {
  success: boolean;
}

/**
 * Sanitization rule for data processing - simplified to only remove sensitive fields
 */
export interface ISanitizationRule {
  fieldPattern: RegExp | string;
}

/**
 * Response formatter options
 */
export interface ISanitizationOptions {
  sanitize?: boolean;
  sanitizationRules?: ISanitizationRule[];
}

export interface IFormatResponseOptions<T> {
  responseOptions: IResponseOptions<T>;
  sanitizationOptions?: ISanitizationOptions;
}

export interface IFormatPaginatedResponseOptions<T> {
  page: number;
  paginatedData: IPaginatedData<T>;
  responseOptions: IResponseOptions<T>;
  sanitizationOptions?: ISanitizationOptions;
}

export interface IResponseFormatter {
  formatResponse<T>(formatOptions: IFormatResponseOptions<T>): IApiResponse<T>;
  formatPaginatedResponse<T>(
    formatOptions: IFormatPaginatedResponseOptions<T>
  ): IApiResponse<T[]>;
  getPaginationQueries(
    options: IGetPaginationQueriesOptions
  ): Omit<IFindAllDto, "userId">;
}
