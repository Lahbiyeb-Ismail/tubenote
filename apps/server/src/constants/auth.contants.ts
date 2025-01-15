import envConfig from "../config/env.config";

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
export const ACCESS_TOKEN_EXPIRE = envConfig.jwt.access_token.expire;

/**
 * Secret key used for signing and verifying refresh tokens.
 * This value is retrieved from the environment configuration.
 */
export const REFRESH_TOKEN_SECRET = envConfig.jwt.refresh_token.secret;

/**
 * The expiration time for the refresh token.
 * This value is retrieved from the environment configuration.
 */
export const REFRESH_TOKEN_EXPIRE = envConfig.jwt.refresh_token.expire;
