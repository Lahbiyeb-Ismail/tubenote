import { envConfig } from "@modules/shared";

/**
 * The name of the refresh token cookie.
 * This value is retrieved from the environment configuration.
 */
export const REFRESH_TOKEN_NAME = envConfig.jwt.refresh_token.cookie_name;

/**
 * Secret key used for signing and verifying access tokens.
 * This value is retrieved from the environment configuration.
 */
export const ACCESS_TOKEN_SECRET = envConfig.jwt.access_token.secret;

/**
 * The expiration time for the access token.
 * This value is retrieved from the environment configuration.
 */
export const ACCESS_TOKEN_EXPIRES_IN = envConfig.jwt.access_token.expires_in;

/**
 * Secret key used for signing and verifying refresh tokens.
 * This value is retrieved from the environment configuration.
 */
export const REFRESH_TOKEN_SECRET = envConfig.jwt.refresh_token.secret;

/**
 * The expiration time for the refresh token.
 * This value is retrieved from the environment configuration.
 */
export const REFRESH_TOKEN_EXPIRES_IN = envConfig.jwt.refresh_token.expires_in;

/**
 * Secret key used for signing and verifying verify email tokens.
 * This value is retrieved from the environment configuration.
 */
export const VERIFY_EMAIL_TOKEN_SECRET =
  envConfig.jwt.verify_email_token.secret;

/**
 * The expiration time for the verify email token.
 * This value is retrieved from the environment configuration.
 */
export const VERIFY_EMAIL_TOKEN_EXPIRES_IN =
  envConfig.jwt.verify_email_token.expires_in;

/**
 * Secret key used for signing and verifying reset password tokens.
 * This value is retrieved from the environment configuration.
 */
export const RESET_PASSWORD_TOKEN_SECRET =
  envConfig.jwt.reset_password_token.secret;

/**
 * The expiration time for the reset password token.
 * This value is retrieved from the environment configuration.
 */
export const RESET_PASSWORD_TOKEN_EXPIRES_IN =
  envConfig.jwt.reset_password_token.expires_in;
