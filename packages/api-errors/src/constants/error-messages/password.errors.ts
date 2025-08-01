/**
 * Password-related error messages for validation and authentication.
 * These constants provide standardized error messages for password operations.
 */
export const PASSWORD_ERRORS = {
  /** Error message when password doesn't meet strength requirements */
  TOO_WEAK: "The password provided is too weak.",
  /** Error message when new password matches the current password */
  PASSWORD_SAME_AS_CURRENT:
    "The new password must be different from the current password.",
} as const;
