import type { FindManyDto } from "@common/dtos/find-many.dto";
import type { QueryPaginationDto } from "@common/dtos/query-pagination.dto";
import type {
  ApiResponse,
  ApiResponseOptions,
  IResponseFormatter,
  PaginatedResult,
  PaginationInfo,
} from "@modules/utils/response-formatter";

/**
 * API response formatter.
 */
export class ResponseFormatter implements IResponseFormatter {
  /**
   * Returns a standardized API response object.
   *
   * @param data - The response data of any type.
   * @param options - Optional settings (status, message, pagination info).
   * @returns A standardized response object.
   */
  formatResponse<T>(data: T, options?: ApiResponseOptions): ApiResponse<T> {
    const { status, message, pagination } = options || {};

    const response: ApiResponse<T> = {
      success: true,
      data,
    };

    if (message) {
      response.message = message;
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
    paginationQuery: QueryPaginationDto,
    result: PaginatedResult<T>
  ): ApiResponse<T[]> {
    const currentPage = Number(paginationQuery.page) || 1;

    const pagination: PaginationInfo = {
      totalPages: result.totalPages,
      currentPage,
      totalItems: result.totalItems,
      hasNextPage: currentPage < result.totalPages,
      hasPrevPage: currentPage > 1,
    };

    return this.formatResponse<T[]>(result.items, { pagination });
  }

  /**
   * Extracts and calculates pagination parameters from the query.
   *
   * @param queries - Query parameters containing pagination and sorting details.
   * @param defaultLimit - Default items per page (default is 8).
   * @returns An object with pagination parameters (skip, limit, and sort options) excluding the userId.
   */
  getPaginationQueries(
    queries: QueryPaginationDto,
    defaultLimit = 8
  ): Omit<FindManyDto, "userId"> {
    const page = Math.max(Number(queries.page) || 1, 1);
    const limit = Math.max(Number(queries.limit) || defaultLimit, 1);
    const skip = (page - 1) * limit;

    return {
      skip,
      limit,
      sort: {
        by: queries.sortBy || "createdAt",
        order: queries.order || "desc",
      },
    };
  }
}
