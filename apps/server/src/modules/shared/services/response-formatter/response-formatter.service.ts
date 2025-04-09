import type { IFindManyDto } from "@tubenote/dtos";
import type {
  IApiResponse,
  IFormatPaginatedResponseOptions,
  IFormatResponseOptions,
  IGetPaginationQueriesOptions,
  IPaginationInfo,
  IResponseFormatter,
  ISanitizationOptions,
  ISanitizationRule,
} from "./response-formatter.types";

/**
 * @class ResponseFormatter
 * @description A utility class for standardizing API responses and sanitizing sensitive data.
 *
 * The ResponseFormatter provides a consistent structure for API responses, including success/error
 * status, HTTP status codes, messages, and properly sanitized data. It automatically removes
 * sensitive information from response data to prevent accidental exposure of confidential information.
 */
export class ResponseFormatter implements IResponseFormatter {
  /**
   * Singleton instance of the ResponseFormatter
   * @private
   */
  private static _instance: ResponseFormatter;

  /**
   * Default sanitization rules for common sensitive data
   * These rules define patterns for fields that should be removed from responses
   * @private
   * @readonly
   */
  private readonly _defaultSanitizationRules: ISanitizationRule[] = [
    { fieldPattern: /password/i },
    // { fieldPattern: /token|api[_-]?key|secret/i },
    { fieldPattern: /credit[_-]?card|card[_-]?number/i },
    { fieldPattern: /ssn|social[_-]?security/i },
    { fieldPattern: /auth|authorization/i },
    { fieldPattern: /key/i },
    { fieldPattern: /private[_-]?key/i },
    { fieldPattern: /secret[_-]?key/i },
  ];

  /**
   * Default sanitization options
   */
  private readonly _defaultOptions: ISanitizationOptions = {
    sanitize: true,
    sanitizationRules: [...this._defaultSanitizationRules],
  };

  /**
   * Constructs a new instance of the ResponseFormatterService.
   *
   * @param _sanitizationOptions - An optional object containing sanitization options.
   *                               Defaults to an empty object. These options are merged
   *                               with the default options to configure the sanitization behavior.
   */
  private constructor(
    private readonly _sanitizationOptions: ISanitizationOptions = {}
  ) {
    this._sanitizationOptions = {
      ...this._defaultOptions,
      ..._sanitizationOptions,
    };
  }

  /**
   * Retrieves the singleton instance of the `ResponseFormatter` class.
   * If the instance does not already exist, it creates a new one.
   *
   * @returns {ResponseFormatter} The singleton instance of `ResponseFormatter`.
   */
  public static getInstance(): ResponseFormatter {
    if (!this._instance) {
      this._instance = new ResponseFormatter();
    }
    return this._instance;
  }

  /**
   * Sanitizes sensitive data in the provided object or array.
   *
   * @param data - The data to be sanitized (can be an object, array, or primitive).
   * @param rules - An optional array of sanitization rules to override default rules.
   * @returns The sanitized data with sensitive fields removed.
   */
  sanitizeData<T>(
    data: T,
    rules: ISanitizationRule[] = this._defaultSanitizationRules
  ): T {
    if (!data) return data;

    // Handle arrays
    if (Array.isArray(data)) {
      return data.map((item) => this.sanitizeData(item, rules)) as unknown as T;
    }

    // Handle objects
    if (typeof data === "object" && data !== null) {
      const sanitized = { ...data };

      for (const key in sanitized) {
        // Check if the current field matches any sensitive data pattern
        if (this.isFieldSensitive(key, rules)) {
          delete (sanitized as any)[key];
        } else if (
          typeof (sanitized as any)[key] === "object" &&
          (sanitized as any)[key] !== null
        ) {
          // Recursively sanitize nested objects
          (sanitized as any)[key] = this.sanitizeData(
            (sanitized as any)[key],
            rules
          );
        }
      }

      return sanitized;
    }

    return data;
  }

  /**
   * Checks if a field name matches any of the sensitive data patterns.
   *
   * @param fieldName - The name of the field to check.
   * @param rules - An array of sanitization rules to check against.
   * @returns A boolean indicating whether the field is sensitive.
   */
  isFieldSensitive(fieldName: string, rules: ISanitizationRule[]): boolean {
    return rules.some((rule) => {
      if (rule.fieldPattern instanceof RegExp) {
        return rule.fieldPattern.test(fieldName);
      }
      return rule.fieldPattern === fieldName;
    });
  }

  /**
   * Returns a standardized API response object.
   *
   * @param responseOptions - The response options including status, message, data, and pagination.
   * @param sanitizationOptions - Optional sanitization options to override default settings.
   * @returns A standardized response object with the provided options.
   */
  formatResponse<T>(formatOptions: IFormatResponseOptions<T>): IApiResponse<T> {
    const { responseOptions, sanitizationOptions } = formatOptions;

    const { status, message, data, pagination } = responseOptions;

    const sanitization = {
      ...this._sanitizationOptions,
      ...sanitizationOptions,
    };

    const response: IApiResponse<T> = {
      success: true,
      message,
      status,
    };

    if (data) {
      const sanitizedData = sanitization.sanitize
        ? this.sanitizeData(data, sanitization.sanitizationRules)
        : data;

      response.data = sanitizedData;
    }

    if (pagination) {
      response.pagination = pagination;
    }

    return response;
  }

  /**
   * Formats a paginated response with pagination information.
   *
   * @param formatOptions - The options for formatting the paginated response.
   * @returns A formatted API response with pagination information.
   */
  formatPaginatedResponse<T>(
    formatOptions: IFormatPaginatedResponseOptions<T>
  ): IApiResponse<T[]> {
    const { page, paginatedData, responseOptions, sanitizationOptions } =
      formatOptions;

    const { totalPages, totalItems, data } = paginatedData;
    const { status, message } = responseOptions;

    const sanitization = {
      ...this._sanitizationOptions,
      ...sanitizationOptions,
    };

    const currentPage = page || 1;

    const pagination: IPaginationInfo = {
      totalPages,
      totalItems,
      currentPage,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    };

    return this.formatResponse<T[]>({
      responseOptions: { status, message, pagination, data },
      sanitizationOptions: sanitization,
    });
  }

  /**
   * Generates pagination queries for database queries.
   *
   * @param options - The options for generating pagination queries.
   * @returns An object containing the skip, limit, and sort options for pagination.
   */
  getPaginationQueries(options: IGetPaginationQueriesOptions): IFindManyDto {
    const { reqQuery, itemsPerPage } = options;
    const page = Math.max(Number(reqQuery.page) || 1, 1);
    const limit = Math.max(Number(reqQuery.limit) || itemsPerPage, 1);
    const skip = (page - 1) * limit;

    return {
      skip,
      limit,
      sort: {
        by: reqQuery.sortBy ?? "createdAt",
        order: reqQuery.order ?? "desc",
      },
    };
  }
}
