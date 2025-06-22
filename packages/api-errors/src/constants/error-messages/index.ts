import { AUTH_ERRORS } from "./auth.errors";
import { DATABASE_ERRORS } from "./database.errors";
import { EMAIL_ERRORS } from "./email.errors";
import { HTTP_ERRORS } from "./http.errors";
import { NOTIFICATION_ERRORS } from "./notification.errors";
import { PASSWORD_ERRORS } from "./password.errors";
import { TOKEN_ERRORS } from "./token.errors";

export const ERROR_MESSAGES = {
  ...DATABASE_ERRORS,
  ...AUTH_ERRORS,
  ...EMAIL_ERRORS,
  ...PASSWORD_ERRORS,
  ...TOKEN_ERRORS,
  ...NOTIFICATION_ERRORS,
  ...HTTP_ERRORS,
} as const;
