import type {
  IFindAllDto,
  IPaginatedData,
  IQueryPaginationDto,
} from "@/modules/shared/dtos";

import type {
  ApiResponse,
  ApiResponseOptions,
  GetPaginationQueriesOptions,
  IResponseFormatter,
  PaginationInfo,
} from "./response-formatter.types";

/**
 * API response formatter.
 */
export class ResponseFormatter implements IResponseFormatter {
  private static _instance: ResponseFormatter;

  private constructor() {}

  public static getInstance(): ResponseFormatter {
    if (!this._instance) {
      this._instance = new ResponseFormatter();
    }
    return this._instance;
  }

  /**
   * Returns a standardized API response object.
   *
   * @param data - The response data of any type.
   * @param options - Optional settings (status, message, pagination info).
   * @returns A standardized response object.
   */
  formatResponse<T>(options?: ApiResponseOptions<T>): ApiResponse<T> {
    const { status, message, pagination, data } = options || {};

    const response: ApiResponse<T> = {
      success: true,
    };

    if (message) {
      response.message = message;
    }

    if (data) {
      response.data = data;
    }

    if (pagination) {
      response.pagination = pagination;
    }

    if (status) {
      response.status = status;
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
    paginationQuery: IQueryPaginationDto,
    paginatedData: IPaginatedData<T>
  ): ApiResponse<T[]> {
    const { totalPages, totalItems, data } = paginatedData;

    const currentPage = Number(paginationQuery.page) || 1;

    const pagination: PaginationInfo = {
      totalPages,
      totalItems,
      currentPage,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    };

    return this.formatResponse<T[]>({ data, pagination });
  }

  /**
   * Extracts and calculates pagination parameters from the query.
   *
   * @param queries - Query parameters containing pagination and sorting details.
   * @param defaultLimit - Default items per page (default is 8).
   * @returns An object with pagination parameters (skip, limit, and sort options) excluding the userId.
   */
  getPaginationQueries(
    options: GetPaginationQueriesOptions
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
