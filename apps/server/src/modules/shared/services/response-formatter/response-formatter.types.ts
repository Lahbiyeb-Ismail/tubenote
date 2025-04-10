import type { IFindManyDto, IPaginationQueryDto } from "@tubenote/dtos";
import type { IApiResponse, IPaginatedData } from "@tubenote/types";

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
 * Represents the options for formatting a response.
 * This interface extends the `IApiResponse` interface, allowing for
 * additional customization or specification of response-related properties.
 *
 * @template T - The type of the data contained in the response.
 */
export interface IResponseOptions<T> extends IApiResponse<T> {}

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
   * Options for customizing the response structure.
   */
  responseOptions: IResponseOptions<T>;

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
   * Formats a standard API response.
   *
   * @template T - The type of the data being formatted.
   * @param formatOptions - Options for formatting the response.
   * @returns The formatted API response.
   */
  formatResponse<T>(formatOptions: IFormatResponseOptions<T>): IApiResponse<T>;

  /**
   * Formats a paginated API response.
   *
   * @template T - The type of the data being formatted.
   * @param formatOptions - Options for formatting the paginated response.
   * @returns The formatted paginated API response containing an array of data.
   */
  formatPaginatedResponse<T>(
    formatOptions: IFormatPaginatedResponseOptions<T>
  ): IApiResponse<T[]>;

  /**
   * Retrieves pagination query parameters based on the provided options.
   *
   * @param options - Options for generating pagination queries.
   * @returns An object containing pagination query parameters.
   */
  getPaginationQueries(options: IGetPaginationQueriesOptions): IFindManyDto;
}
