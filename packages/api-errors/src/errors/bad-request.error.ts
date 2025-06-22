import * as httpStatus from "http-status";

import { BaseError } from "./base.error";

/**
 * Represents a BadRequestError which is thrown when the server cannot process the client's request due to malformed syntax.
 * Extends BaseError with a default HTTP status code of 400 (Bad Request).
 *
 * @class
 * @extends BaseError
 * @param message - A descriptive message of the error
 * @param errorName - A code identifying the error type, defaults to "BAD_REQUEST"
 * @param metadata - Additional information about the error, defaults to an empty object
 */
export class BadRequestError extends BaseError {
  constructor(message: string, errorName: string = "BAD_REQUEST", metadata: Record<string, unknown> = {}) {
    super(errorName, httpStatus.BAD_REQUEST, message, true, metadata);
  }
}
