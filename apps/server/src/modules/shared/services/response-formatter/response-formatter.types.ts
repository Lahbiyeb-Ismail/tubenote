import type { IFindManyDto, IPaginationQueryDto } from "@tubenote/dtos";
import type {
  IApiErrorResponse,
  IApiSuccessResponse,
  IPaginatedData,
  IPaginationMeta,
} from "@tubenote/types";

/**
 * Options for retrieving pagination queries.
 */
export interface IGetPaginationQueriesOptions {
  /**
   * The request query object containing pagination parameters.
   */
  reqQuery: IPaginationQueryDto;

  /**
   * The number of items to display per page.
   */
  itemsPerPage: number;
}

/**
 * Options for formatting a response.
 */
export interface IResponseOptions<T> {
  /**
   * Whether the operation was successful. Defaults to true.
   */
  success?: boolean;

  /**
   * The HTTP status code for the response.
   */
  statusCode?: number;

  /**
   * The message describing the result of the operation.
   */
  message: string;

  /**
   * The data to include in the response.
   */
  data?: T;

  /**
   * Pagination metadata for paginated responses.
   */
  paginationMeta?: IPaginationMeta;

  /**
   * Additional metadata to include in the response.
   */
  metadata?: Record<string, any>;
}

/**
 * Details about an error that occurred.
 */
export interface IErrorDetails {
  /**
   * A map of field names to error messages.
   */
  [field: string]: string | string[] | Record<string, any>;
}

/**
 * Options for formatting an error response.
 */
export interface IFormatErrorResponseOptions {
  /**
   * A message describing the error.
   */
  message: string;

  /**
   * The HTTP status code for the error.
   */
  statusCode: number;

  /**
   * A code identifying the type of error.
   */
  name?: string;

  /**
   * Additional details about the error.
   */
  errorDetails?: IErrorDetails;

  /**
   * The stack trace for the error (only included in development).
   */
  stack?: string;

  /**
   * Additional metadata to include in the response.
   */
  metadata?: Record<string, any>;
}

/**
 * Represents a rule for sanitizing data fields.
 *
 * @property fieldPattern - A pattern used to match fields that need to be sanitized.
 *                          This can be a regular expression or a string.
 */
export interface ISanitizationRule {
  fieldPattern: RegExp | string;
}
/**
 * Represents options for sanitization.
 *
 * @property sanitize - A boolean indicating whether to sanitize the data or not.
 * @property sanitizationRules - An array of rules that define how to sanitize specific fields.
 */
export interface ISanitizationOptions {
  sanitize?: boolean;
  sanitizationRules?: ISanitizationRule[];
}

/**
 * Represents the options for formatting a response.
 * This interface extends the `IApiResponse` interface, allowing for
 * additional customization or specification of response-related properties.
 *
 * @template T - The type of the data contained in the response.
 */
export interface IFormatResponseOptions<T> {
  responseOptions: IResponseOptions<T>;
  sanitizationOptions?: ISanitizationOptions;
}

/**
 * Options for formatting a paginated response.
 *
 * @template T - The type of the data being paginated.
 */
export interface IFormatPaginatedResponseOptions<T> {
  /**
   * The current page number of the paginated data.
   */
  page: number;

  /**
   * The paginated data containing items and metadata.
   */
  paginatedData: IPaginatedData<T>;

  /**
   * The response options.
   */
  responseOptions: Omit<IResponseOptions<T[]>, "data" | "paginationMeta">;

  /**
   * Optional sanitization options to apply to the response data.
   */
  sanitizationOptions?: ISanitizationOptions;
}

/**
 * Interface for formatting API responses.
 */
export interface IResponseFormatter {
  /**
   * Formats a successful API response with the provided data and options.
   */
  formatSuccessResponse<T>(
    formatOptions: IFormatResponseOptions<T>
  ): IApiSuccessResponse<T>;

  /**
   * Formats an error API response with the provided error details.
   */
  formatErrorResponse(options: IFormatErrorResponseOptions): IApiErrorResponse;

  /**
   * Formats a paginated API response.
   *
   * @template T - The type of the data being formatted.
   * @param formatOptions - Options for formatting the paginated response.
   * @returns The formatted paginated API response containing an array of data.
   */
  formatPaginatedResponse<T>(
    formatOptions: IFormatPaginatedResponseOptions<T>
  ): IApiSuccessResponse<T[]>;

  /**
   * Retrieves pagination query parameters based on the provided options.
   *
   * @param options - Options for generating pagination queries.
   * @returns An object containing pagination query parameters.
   */
  getPaginationQueries(options: IGetPaginationQueriesOptions): IFindManyDto;
}
