import httpStatus from "http-status";

import { BaseError } from "./base.error";

/**
 * Represents a NotFoundError which is thrown when the server cannot find the requested resource.
 * Extends BaseError with a default HTTP status code of 404 (Not Found).
 *
 * @class
 * @extends BaseError
 * @param message - A descriptive message of the error
 * @param errorName - A code identifying the error type, defaults to "NOT_FOUND"
 * @param metadata - Additional information about the error, defaults to an empty object
 */
export class NotFoundError extends BaseError {
  constructor(message: string, errorName: string = "NOT_FOUND", metadata: Record<string, unknown> = {}) {
    super(errorName, httpStatus.NOT_FOUND, message, true, metadata);
  }
}
