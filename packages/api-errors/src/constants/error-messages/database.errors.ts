/**
 * Database error messages constants used throughout the application.
 *
 * @description This object contains standardized error messages for common database operations.
 * These messages provide consistent user-facing error descriptions when database operations fail.
 *
 * @constant
 * @readonly
 *
 * @example
 * ```typescript
 * throw new Error(DATABASE_ERRORS.RESOURCE_NOT_FOUND);
 * ```
 */
export const DATABASE_ERRORS = {
  RESOURCE_NOT_FOUND: "The requested resource could not be found.",
  FAILED_TO_FIND: "Failed to find the resource.",
  FAILED_TO_CREATE: "Failed to create the resource.",
  FAILED_TO_DELETE: "Failed to delete the resource.",
  FAILED_TO_UPDATE: "Failed to update the resource.",
  FAILED_TO_COUNT: "Failed to count the resources.",
  FAILED_TO_DELETE_ALL: "Failed to delete all resources.",
} as const;
