import type { CookieOptions } from "express";

import { envConfig } from "@/modules/shared/config";

/**
 * Configuration options for the refresh token cookie.
 *
 * @constant
 * @type {CookieOptions}
 * @property {boolean} httpOnly - Indicates if the cookie is accessible only through the HTTP protocol.
 * @property {boolean} sameSite - Indicates if the cookie is restricted to the same site.
 * @property {boolean} secure - Indicates if the cookie is only to be sent over HTTPS.
 * @property {number} maxAge - The maximum age of the cookie in milliseconds (24 hours).
 */
export const refreshTokenCookieConfig: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: envConfig.node_env === "production",
  maxAge: 24 * 60 * 60 * 1000,
};

/**
 * Configuration object for clearing the refresh token cookie.
 *
 * @constant
 * @type {CookieOptions}
 * @property {boolean} httpOnly - Indicates if the cookie is accessible only through the HTTP protocol.
 * @property {boolean} sameSite - Indicates if the cookie is restricted to the same site.
 * @property {boolean} secure - Indicates if the cookie is only to be sent over HTTPS.
 * This is true if the environment is production.
 */
export const clearRefreshTokenCookieConfig: CookieOptions = {
  httpOnly: true,
  sameSite: false,
  secure: envConfig.node_env === "production",
};
