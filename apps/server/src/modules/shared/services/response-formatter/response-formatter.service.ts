import type { IFindAllDto, IPaginatedData } from "@/modules/shared/dtos";

import type {
  IApiResponse,
  IGetPaginationQueriesOptions,
  IPaginationInfo,
  IResponseFormatter,
  IResponseOptions,
  ISanitizationOptions,
  ISanitizationRule,
} from "./response-formatter.types";

/**
 * API response formatter.
 */
export class ResponseFormatter implements IResponseFormatter {
  private static _instance: ResponseFormatter;

  /**
   * Default sanitization rules for common sensitive data
   */
  private readonly _defaultSanitizationRules: ISanitizationRule[] = [
    { fieldPattern: /password/i },
    { fieldPattern: /token|api[_-]?key|secret/i },
    { fieldPattern: /credit[_-]?card|card[_-]?number/i },
    { fieldPattern: /ssn|social[_-]?security/i },
    { fieldPattern: /auth|authorization/i },
    { fieldPattern: /private[_-]?key/i },
    { fieldPattern: /access[_-]?key/i },
    { fieldPattern: /secret[_-]?key/i },
  ];

  /**
   * Default sanitization options
   */
  private readonly _defaultOptions: ISanitizationOptions = {
    sanitize: true,
    sanitizationRules: [...this._defaultSanitizationRules],
  };

  private constructor(
    private readonly _sanitizationOptions: ISanitizationOptions = {}
  ) {
    this._sanitizationOptions = {
      ...this._defaultOptions,
      ..._sanitizationOptions,
    };
  }

  public static getInstance(): ResponseFormatter {
    if (!this._instance) {
      this._instance = new ResponseFormatter();
    }
    return this._instance;
  }

  /**
   * Sanitize data by removing sensitive fields based on provided rules
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
   * Check if a field name matches any of the sensitive data patterns
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
   * @param data - The response data of any type.
   * @param options - Optional settings (status, message, pagination info).
   * @returns A standardized response object.
   */
  formatResponse<T>(
    responseOptions: IResponseOptions<T>,
    sanitizationOptions?: ISanitizationOptions
  ): IApiResponse<T> {
    const { status, message, pagination, data } = responseOptions;
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
   * Returns a standardized paginated API response object.
   *
   * @param paginationQuery - Query parameters including pagination details.
   * @param result - The paginated result data.
   * @returns A standardized response object with pagination metadata.
   */
  formatPaginatedResponse<T>(
    page: number,
    paginatedData: IPaginatedData<T>,
    responseOptions: IResponseOptions<T>,
    IsanitizationOptions?: ISanitizationOptions
  ): IApiResponse<T[]> {
    const { totalPages, totalItems, data } = paginatedData;
    const { status, message } = responseOptions;
    const sanitization = {
      ...this._sanitizationOptions,
      ...IsanitizationOptions,
    };

    const currentPage = page || 1;

    const pagination: IPaginationInfo = {
      totalPages,
      totalItems,
      currentPage,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    };

    return this.formatResponse<T[]>(
      { data, pagination, status, message },
      sanitization
    );
  }

  /**
   * Extracts and calculates pagination parameters from the query.
   *
   * @param queries - Query parameters containing pagination and sorting details.
   * @param defaultLimit - Default items per page (default is 8).
   * @returns An object with pagination parameters (skip, limit, and sort options) excluding the userId.
   */
  getPaginationQueries(
    options: IGetPaginationQueriesOptions
  ): Omit<IFindAllDto, "userId"> {
    const { reqQuery, itemsPerPage } = options;
    const page = Math.max(Number(reqQuery.page) || 1, 1);
    const limit = Math.max(Number(reqQuery.limit) || itemsPerPage, 1);
    const skip = (page - 1) * limit;

    return {
      skip,
      limit,
      sort: {
        by: reqQuery.sortBy || "createdAt",
        order: reqQuery.order || "desc",
      },
    };
  }
}
