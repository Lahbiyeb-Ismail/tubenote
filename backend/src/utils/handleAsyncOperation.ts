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
 * Handles an asynchronous operation and provides error handling.
 *
 * @template T - The type of the result of the asynchronous operation.
 * @param {AsyncOperation<T>} operation - The asynchronous operation to be executed.
 * @param {ErrorHandlerOptions} options - Options for error handling.
 * @param {string} options.errorMessage - The error message to be logged and thrown if the operation fails.
 * @returns {Promise<T>} - A promise that resolves to the result of the asynchronous operation.
 * @throws {Error} - Throws an error with the provided error message if the operation fails.
 */
async function handleAsyncOperation<T>(
  operation: AsyncOperation<T>,
  options: ErrorHandlerOptions
): Promise<T> {
  const { errorMessage } = options;

  try {
    return await operation();
  } catch (error) {
    console.error(`${errorMessage}:`, error);

    throw new Error(errorMessage);
  }
}

export default handleAsyncOperation;
