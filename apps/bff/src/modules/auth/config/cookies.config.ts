import type { CookieOptions } from "express";

import { envConfig } from "@/config";

/**
 * Configuration options for the session ID cookie.
 *
 * This configuration ensures secure cookie handling with the following settings:
 * - HttpOnly: Prevents client-side JavaScript access to mitigate XSS attacks
 * - SameSite: Set to "lax" to allow cross-site requests for navigation while preventing CSRF
 * - Secure: Enforced in production to ensure cookies are only sent over HTTPS
 * - Path: Available across the entire application
 * - MaxAge: Cookie expires after 24 hours (86,400,000 milliseconds)
 */
export const sessionIdCookieConfig: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: envConfig.node_env === "production",
  path: "/",
  // Set the cookie to expire in 24 hours
  maxAge: 24 * 60 * 60 * 1000,
};

/**
 * Configuration object for clearing the session ID cookie.
 *
 * @remarks
 * This configuration ensures secure cookie clearing by:
 * - Preventing client-side JavaScript access via httpOnly
 * - Using lax SameSite policy for CSRF protection
 * - Enabling secure flag in production environments
 * - Setting domain to match the client application's hostname
 *
 * @example
 * ```typescript
 * res.clearCookie('sessionId', clearSessionIdCookieConfig);
 * ```
 */
export const clearSessionIdCookieConfig: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: envConfig.node_env === "production",
  domain: new URL(envConfig.client.url).hostname,
};
