import httpStatus from "http-status";

import { BaseError } from "./base.error";

/**
 * Represents a DatabaseError which is thrown when there is an error related to database operations.
 * Extends BaseError with a default HTTP status code of 500 (Internal Server Error).
 *
 * @class
 * @extends BaseError
 * @param message - A descriptive message of the error
 * @param errorName - A code identifying the error type, defaults to "DATABASE_ERROR"
 * @param metadata - Additional information about the error, defaults to an empty object
 */
export class DatabaseError extends BaseError {
  constructor(message: string, errorName: string = "DATABASE_ERROR", metadata: Record<string, unknown> = {}) {
    super(
      errorName,
      httpStatus.INTERNAL_SERVER_ERROR,
      message,
      false,
      metadata,
    );
  }
}
