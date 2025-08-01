/**
 * HTTP error message constants for common HTTP status codes.
 *
 * This object contains standardized error messages that can be used
 * across the application when handling HTTP errors. All values are
 * marked as `const` to ensure immutability.
 *
 * @example
 * ```typescript
 * throw new Error(HTTP_ERRORS.BAD_REQUEST);
 * ```
 *
 * @readonly
 */
export const HTTP_ERRORS = {
  BAD_REQUEST:
    "The request could not be understood or was missing required parameters.",
  INTERNAL_SERVER_ERROR: "An unexpected error occurred on the server.",
} as const;
