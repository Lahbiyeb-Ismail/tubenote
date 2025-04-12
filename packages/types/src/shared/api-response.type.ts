import type { IPaginationMeta } from "./paginated-data.type";

/**
 * Represents a standardized structure for a successful API response.
 *
 * @template T - The type of the data included in the response payload.
 *
 * @property success - Indicates whether the API request was successful.
 * @property statusCode - The HTTP status code associated with the response.
 * @property payload - The main content of the response.
 * @property payload.message - A descriptive message about the response.
 * @property payload.data - (Optional) The data returned by the API, if any.
 * @property payload.paginationMeta - (Optional) Metadata for paginated responses, if applicable.
 */
export interface IApiSuccessResponse<T> {
  success: boolean;
  statusCode: number;
  payload: {
    message: string;
    data: T;
    paginationMeta?: IPaginationMeta;
  };
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
 * Represents the structure of an API error response.
 */
export interface IApiErrorResponse {
  /**
   * Indicates whether the API request was successful.
   */
  success: boolean;

  /**
   * The HTTP status code of the response.
   */
  statusCode: number;

  /**
   * The payload containing details about the error.
   */
  payload: {
    /**
     * A descriptive message about the error.
     */
    message: string;

    /**
     * A name or code identifying the type of error.
     */
    name?: string;

    /**
     * Optional detailed information about the error.
     */
    errorDetails?: IErrorDetails;
  };
}
