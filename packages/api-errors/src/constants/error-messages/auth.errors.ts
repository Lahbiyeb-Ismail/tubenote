export const AUTH_ERRORS = {
  INVALID_CREDENTIALS:
    "The email or password you entered is incorrect. Please try again.",
  UNAUTHORIZED:
    "You are not authorized to access this resource. Please log in and try again.",
  FORBIDDEN: "You do not have permission to perform this action.",
  TOO_MANY_ATTEMPTS: "Too many attempts, please try again later",
  ACCOUNT_TEMPORARILY_LOCKED:
    "Account temporarily locked due to too many failed attempts",
} as const;
