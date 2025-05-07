/**
 * Error messages related to CSRF (Cross-Site Request Forgery) protection
 */
export const CSRF_ERRORS = {
  /**
   * Error message for when a CSRF token is invalid or missing
   */
  INVALID_CSRF_TOKEN:
    "Invalid or missing CSRF token. This could be an attempted CSRF attack or your session may have expired. Please refresh the page and try again.",

  /**
   * Error message for when a CSRF token has expired
   */
  EXPIRED_CSRF_TOKEN:
    "Your security token has expired. Please refresh the page and try again.",

  /**
   * Error message for when a CSRF token from another user is used
   */
  MISMATCHED_CSRF_TOKEN:
    "Security validation failed. The request appears to be from a different session.",
} as const;
