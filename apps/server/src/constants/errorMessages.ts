export const ERROR_MESSAGES = {
  RESOURCE_NOT_FOUND: "The requested resource could not be found.",
  EMAIL_ALREADY_EXISTS:
    "The email address provided is already associated with another account.",
  EMAIL_NOT_VERIFIED: "Email not verified. Please verify your email address.",
  EMAIL_ALREADY_VERIFIED: "Email already verified.",
  INVALID_CREDENTIALS:
    "The email or password you entered is incorrect. Please try again.",
  UNAUTHORIZED:
    "You are not authorized to access this resource. Please log in and try again.",
  FORBIDDEN: "You do not have permission to perform this action.",
  BAD_REQUEST:
    "The request could not be understood or was missing required parameters.",
  INTERNAL_SERVER_ERROR: "An unexpected error occurred on the server.",
  INVALID_EMAIL_FORMAT: "The email address provided is not in a valid format.",
  PASSWORD_TOO_WEAK: "The password provided is too weak.",
  PASSWORD_SAME_AS_CURRENT:
    "The new password must be different from the current password.",
  RESET_LINK_SENT: "A password reset link has already been sent to your email.",
  VERIFICATION_LINK_SENT:
    "A verification link has already been sent to your email.",
  INVALID_TOKEN: "The provided token is invalid.",
  EXPIRED_TOKEN: "The provided token has expired.",
} as const;
