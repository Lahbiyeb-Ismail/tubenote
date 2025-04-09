import type { IFindManyDto } from "@tubenote/dtos";
import type { IApiResponse } from "@tubenote/types";

import type {
  IPaginatedData,
  IQueryPaginationDto,
} from "@/modules/shared/dtos";

export interface IGetPaginationQueriesOptions {
  reqQuery: IQueryPaginationDto;
  itemsPerPage: number;
}

export interface IResponseOptions<T> extends IApiResponse<T> {}

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
  getPaginationQueries(options: IGetPaginationQueriesOptions): IFindManyDto;
}
