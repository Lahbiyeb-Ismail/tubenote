export const EMAIL_ERRORS = {
  ALREADY_EXISTS:
    "The email address provided is already associated with another account.",
  NOT_VERIFIED: "Email not verified. Please verify your email address.",
  ALREADY_VERIFIED: "Email already verified.",
  INVALID_FORMAT: "The email address provided is not in a valid format.",
  UNREGISTERED: "The provided email address is not registered.",
  MAIL_SENDING_FAILED: "An error occurred while sending the email.",
} as const;
