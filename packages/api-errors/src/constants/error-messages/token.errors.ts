/**
 * Token-related error messages used throughout the application.
 *
 * @remarks
 * This constant object contains standardized error messages for token validation
 * and authentication scenarios. The messages are defined as readonly to prevent
 * accidental modification at runtime.
 *
 * @example
 * ```typescript
 * throw new Error(TOKEN_ERRORS.INVALID_TOKEN);
 * // or
 * return { error: TOKEN_ERRORS.EXPIRED_TOKEN };
 * ```
 */
export const TOKEN_ERRORS = {
  INVALID_TOKEN: "The provided token is invalid.",
  EXPIRED_TOKEN: "The provided token has expired.",
} as const;
