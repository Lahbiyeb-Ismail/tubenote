import httpStatus from "http-status";

import { BaseError } from "./base.error";

/**
 * Represents a ConflictError which is thrown when the server cannot process the client's request due to a conflict with the current state of the resource.
 * Extends BaseError with a default HTTP status code of 409 (Conflict).
 *
 * @class
 * @extends BaseError
 * @param message - A descriptive message of the error
 * @param errorName - A code identifying the error type, defaults to "CONFLICT"
 * @param metadata - Additional information about the error, defaults to an empty object
 */
export class ConflictError extends BaseError {
  constructor(message: string, errorName: string = "CONFLICT", metadata: Record<string, unknown> = {}) {
    super(errorName, httpStatus.CONFLICT, message, true, metadata);
  }
}
