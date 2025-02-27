import { Prisma } from "@prisma/client";

import { DatabaseError, loggerService } from "@modules/shared";

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
export async function handleAsyncOperation<T>(
  operation: AsyncOperation<T>,
  options: ErrorHandlerOptions
): Promise<T> {
  const { errorMessage } = options;

  try {
    return await operation();
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientValidationError ||
      error instanceof Prisma.PrismaClientUnknownRequestError
    ) {
      // Log the detailed error for debugging
      console.error("Prisma error details:", {
        errorType: error.constructor.name,
        errorCode: "code" in error ? error.code : undefined,
        errorMessage: error.message,
        errorName: error.name,
      });

      throw new DatabaseError(`A database error occurred: ${errorMessage}`);
    }

    if (
      error instanceof Prisma.PrismaClientInitializationError ||
      error instanceof Prisma.PrismaClientRustPanicError
    ) {
      // Log the critical error
      console.error("Critical Prisma error:", error);

      throw new DatabaseError(
        `A critical database error occurred: ${errorMessage}`
      );
    }

    if (error instanceof Error) {
      // Log the unexpected error
      loggerService.error(`Unexpected error: ${error}`);

      // Throw a generic error for the client
      throw new DatabaseError(`An unexpected error occurred: ${errorMessage}`);
    }
    // Log the unknown error
    loggerService.error(`Unknown error: ${error}`);

    throw new DatabaseError(`Unknow error: ${errorMessage}`);
  }
}
