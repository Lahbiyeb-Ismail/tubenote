import httpStatus from "http-status";

import { BaseError } from "./base.error";

/**
 * Represents a InternalServerError which is thrown when the server cannot process the client's request due to a generic error.
 * Extends BaseError with a default HTTP status code of 500 (Internal Server Error).
 *
 * @class
 * @extends BaseError
 * @param message - A descriptive message of the error
 * @param errorName - A code identifying the error type, defaults to "INTERNAL_SERVER_ERROR"
 * @param metadata - Additional information about the error, defaults to an empty object
 */
export class InternalServerError extends BaseError {
  constructor(message: string, errorName: string = "INTERNAL_SERVER_ERROR", metadata: Record<string, unknown> = {}) {
    super(
      errorName,
      httpStatus.INTERNAL_SERVER_ERROR,
      message,
      false,
      metadata,
    );
  }
}
