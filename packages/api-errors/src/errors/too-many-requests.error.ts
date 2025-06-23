import httpStatus from "http-status";

import { BaseError } from "./base.error";

/**
 * Represents a TooManyRequestsError which is thrown when the user has sent too many requests in a given amount of time.
 * Extends BaseError with a default HTTP status code of 429 (Too Many Requests).
 *
 * @class
 * @extends BaseError
 * @param message - A descriptive message of the error
 * @param errorName - A code identifying the error type, defaults to "TOO_MANY_REQUESTS"
 * @param metadata - Additional information about the error, defaults to an empty object
 */
export class TooManyRequestsError extends BaseError {
  constructor(message: string, errorName: string = "TOO_MANY_REQUESTS", metadata: Record<string, unknown> = {}) {
    super(
      errorName,
      httpStatus.TOO_MANY_REQUESTS,
      message,
      true,
      metadata,
    );
  }
}
