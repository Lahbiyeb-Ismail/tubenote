/**
 * Constant object containing standardized error names used throughout the API.
 *
 * @remarks
 * This object uses `as const` assertion to ensure the values are treated as literal types
 * rather than generic strings, providing better type safety and IntelliSense support.
 *
 * @example
 * ```typescript
 * import { ERROR_NAMES } from './error-names';
 *
 * throw new Error(ERROR_NAMES.INVALID_VIDEO_ID);
 * ```
 *
 * @public
 */
export const ERROR_NAMES = {
  INVALID_VIDEO_ID: "INVALID_VIDEO_ID",
  TRANSCRIPT_NOT_FOUND: "TRANSCRIPT_NOT_FOUND",
  TRANSCRIPTS_DISABLED: "TRANSCRIPTS_DISABLED",
  VIDEO_UNAVAILABLE: "VIDEO_UNAVAILABLE",
  INVALID_LANGUAGE: "INVALID_LANGUAGE",
  INVALID_TIME_FORMAT: "INVALID_TIME_FORMAT",
  PYTHON_SCRIPT_ERROR: "PYTHON_SCRIPT_ERROR",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
} as const;
