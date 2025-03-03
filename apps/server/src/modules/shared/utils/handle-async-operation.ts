import { Prisma } from "@prisma/client";

import { DatabaseError } from "../api-errors";
import { loggerService } from "../services";

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

// /**
//  * Base error class for all application errors
//  */
// export class BaseError extends Error {
//   constructor(message: string) {
//     super(message);
//     this.name = this.constructor.name;
//   }
// }

// /**
//  * Database specific error class
//  */
// export class DatabaseError extends BaseError {
//   constructor(message: string) {
//     super(message);
//   }
// }

// /**
//  * Network error class for API and external service errors
//  */
// export class NetworkError extends BaseError {
//   constructor(message: string) {
//     super(message);
//   }
// }

// /**
//  * Validation error class for input validation failures
//  */
// export class ValidationError extends BaseError {
//   constructor(message: string) {
//     super(message);
//   }
// }

// /**
//  * General application error for other types of errors
//  */
// export class ApplicationError extends BaseError {
//   constructor(message: string) {
//     super(message);
//   }
// }

// /**
//  * Represents an asynchronous operation that returns a promise of type T.
//  *
//  * @template T - The type of the value that the promise resolves to.
//  */
// type AsyncOperation<T> = () => Promise<T>;

// /**
//  * Options for handling errors in async operations
//  */
// interface ErrorHandlerOptions {
//   /** Custom error message to include in thrown errors */
//   errorMessage: string;
//   /** Optional context data to include in error logs */
//   context?: Record<string, any>;
//   /** Whether to rethrow the original error (default: false) */
//   rethrowOriginal?: boolean;
// }

// /**
//  * Error categories to classify different types of errors
//  */
// enum ErrorCategory {
//   DATABASE = "database",
//   NETWORK = "network",
//   VALIDATION = "validation",
//   APPLICATION = "application",
//   UNKNOWN = "unknown",
// }

// /**
//  * Determines the category of an error
//  *
//  * @param error - The error to categorize
//  * @returns The appropriate error category
//  */
// function categorizeError(error: unknown): ErrorCategory {
//   // Database errors
//   if (
//     error instanceof Prisma.PrismaClientKnownRequestError ||
//     error instanceof Prisma.PrismaClientValidationError ||
//     error instanceof Prisma.PrismaClientUnknownRequestError ||
//     error instanceof Prisma.PrismaClientInitializationError ||
//     error instanceof Prisma.PrismaClientRustPanicError
//   ) {
//     return ErrorCategory.DATABASE;
//   }

//   // Network errors
//   if (
//     (error instanceof TypeError &&
//       (error.message.includes("fetch") || error.message.includes("network"))) ||
//     (error instanceof Error &&
//       (error.message.includes("timeout") ||
//         error.message.includes("ECONNREFUSED") ||
//         error.message.includes("ENOTFOUND")))
//   ) {
//     return ErrorCategory.NETWORK;
//   }

//   // Validation errors (could be expanded based on your validation library)
//   if (
//     error instanceof Error &&
//     (error.name.includes("Validation") || error.message.includes("validation"))
//   ) {
//     return ErrorCategory.VALIDATION;
//   }

//   // Known Error types
//   if (error instanceof Error) {
//     return ErrorCategory.APPLICATION;
//   }

//   // Unknown errors
//   return ErrorCategory.UNKNOWN;
// }

// /**
//  * Creates an appropriate error instance based on the error category
//  *
//  * @param category - The error category
//  * @param message - The error message
//  * @returns An instance of the appropriate error class
//  */
// function createErrorForCategory(
//   category: ErrorCategory,
//   message: string
// ): BaseError {
//   switch (category) {
//     case ErrorCategory.DATABASE:
//       return new DatabaseError(message);
//     case ErrorCategory.NETWORK:
//       return new NetworkError(message);
//     case ErrorCategory.VALIDATION:
//       return new ValidationError(message);
//     case ErrorCategory.APPLICATION:
//       return new ApplicationError(message);
//     case ErrorCategory.UNKNOWN:
//     default:
//       return new BaseError(message);
//   }
// }

// /**
//  * Handles an asynchronous operation and provides error handling for various types of errors.
//  *
//  * @template T - The type of the result returned by the asynchronous operation.
//  * @param {AsyncOperation<T>} operation - The asynchronous operation to be executed.
//  * @param {ErrorHandlerOptions} options - Options for handling errors, including a custom error message.
//  * @returns {Promise<T>} - A promise that resolves to the result of the asynchronous operation.
//  * @throws {BaseError} - Throws an appropriate error subclass based on the error type.
//  */
// export async function handleAsyncOperation<T>(
//   operation: AsyncOperation<T>,
//   options: ErrorHandlerOptions
// ): Promise<T> {
//   const { errorMessage, context = {}, rethrowOriginal = false } = options;

//   try {
//     return await operation();
//   } catch (error) {
//     // Categorize the error
//     const category = categorizeError(error);

//     // Extract error details for logging
//     const errorDetails = {
//       category,
//       originalError: error,
//       errorType: error instanceof Error ? error.constructor.name : typeof error,
//       errorMessage: error instanceof Error ? error.message : String(error),
//       errorStack: error instanceof Error ? error.stack : undefined,
//       context,
//     };

//     // Log the error with appropriate level based on category
//     if (
//       category === ErrorCategory.DATABASE ||
//       category === ErrorCategory.NETWORK
//     ) {
//       loggerService.error(`${category.toUpperCase()} ERROR:`, errorDetails);
//     } else {
//       loggerService.warn(`${category.toUpperCase()} ERROR:`, errorDetails);
//     }

//     // Add specific handling for database errors
//     if (category === ErrorCategory.DATABASE) {
//       const isPrismaError = error instanceof Prisma.PrismaClientError;
//       const isCritical =
//         error instanceof Prisma.PrismaClientInitializationError ||
//         error instanceof Prisma.PrismaClientRustPanicError;

//       if (isPrismaError) {
//         console.error("Prisma error details:", {
//           errorType: error.constructor.name,
//           errorCode: "code" in error ? error.code : undefined,
//           errorMessage: error.message,
//           errorName: error.name,
//         });
//       }

//       const prefix = isCritical
//         ? "A critical database error occurred: "
//         : "A database error occurred: ";
//       throw new DatabaseError(`${prefix}${errorMessage}`);
//     }

//     // If requested, rethrow the original error
//     if (rethrowOriginal && error instanceof Error) {
//       throw error;
//     }

//     // Create and throw an appropriate error
//     const prefix =
//       category === ErrorCategory.UNKNOWN
//         ? "Unknown error: "
//         : `${category} error: `;
//     throw createErrorForCategory(category, `${prefix}${errorMessage}`);
//   }
// }
