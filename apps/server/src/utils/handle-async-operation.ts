import { DatabaseError } from "@/errors";
import logger from "./logger";

/**
 * Represents an asynchronous operation that returns a promise of type T.
 *
 * @template T - The type of the value that the promise resolves to.
 */
type AsyncOperation<T> = () => Promise<T>;

interface ErrorHandlerOptions {
  errorMessage: string;
}

/**
 * Handles an asynchronous operation and provides error handling for various types of errors.
 *
 * @template T - The type of the result returned by the asynchronous operation.
 * @param {AsyncOperation<T>} operation - The asynchronous operation to be executed.
 * @param {ErrorHandlerOptions} options - Options for handling errors, including a custom error message.
 * @returns {Promise<T>} - A promise that resolves to the result of the asynchronous operation.
 * @throws {BaseError} - Throws a `BaseError` with a generic message for different types of errors:
 *   - `Database Error` for known Prisma client errors.
 *   - `Critical Database Error` for critical Prisma client errors.
 *   - `Unexpected Error` for unexpected errors.
 *   - `Unknown Error` for unknown errors.
 */
async function handleAsyncOperation<T>(
  operation: AsyncOperation<T>,
  options: ErrorHandlerOptions
): Promise<T> {
  const { errorMessage } = options;

  try {
    return await operation();
  } catch (error) {
    logger.error(error);
    throw new DatabaseError(errorMessage);
  }
}

export default handleAsyncOperation;
