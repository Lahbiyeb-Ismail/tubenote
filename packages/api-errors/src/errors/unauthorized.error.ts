import httpStatus from "http-status";

import { BaseError } from "./base.error";

/**
 * Represents a UnauthorizedError which is thrown when the user attempts to access a resource they do not have permission to access.
 * Extends BaseError with a default HTTP status code of 403 (Forbidden).
 *
 * @class
 * @extends BaseError
 * @param message - A descriptive message of the error
 * @param errorName - A code identifying the error type, defaults to "UNAUTHORIZED"
 * @param metadata - Additional information about the error, defaults to an empty object
 */
export class UnauthorizedError extends BaseError {
  constructor(message: string, errorName: string = "UNAUTHORIZED", metadata: Record<string, unknown> = {}) {
    super(errorName, httpStatus.UNAUTHORIZED, message, true, metadata);
  }
}
