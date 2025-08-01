/**
 * Constants for notification-related error messages.
 *
 * Contains standardized error messages for various notification scenarios
 * such as password reset and email verification processes.
 *
 * @example
 * ```typescript
 * throw new Error(NOTIFICATION_ERRORS.RESET_LINK_SENT);
 * ```
 */
export const NOTIFICATION_ERRORS = {
  RESET_LINK_SENT: "A password reset link has already been sent to your email.",
  VERIFICATION_LINK_SENT:
    "A verification link has already been sent to your email.",
} as const;
