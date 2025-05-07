"use client";

import type { AxiosRequestConfig } from "axios";
import { getCookie } from "cookies-next";

/**
 * The name of the CSRF token cookie.
 * Should match the cookie name set by the server-side CSRF service.
 */
export const CSRF_COOKIE_NAME = "csrf_token";

/**
 * The name of the CSRF token header.
 * Should match the header name expected by the server-side CSRF middleware.
 */
export const CSRF_HEADER_NAME = "X-CSRF-Token";

/**
 * The name of the CSRF token form field.
 * Should match the field name expected by the server-side CSRF middleware.
 */
export const CSRF_FIELD_NAME = "_csrf";

/**
 * Gets the CSRF token from cookies
 *
 * @returns The CSRF token or undefined if not found
 */
export function getCsrfToken(): string | undefined {
  return getCookie(CSRF_COOKIE_NAME)?.toString();
}

/**
 * Adds the CSRF token to Axios request config
 *
 * @param config - The Axios request configuration
 * @returns The config with the CSRF token added to the headers
 */
export function addCsrfTokenToRequest<T = any>(
  config: AxiosRequestConfig<T>
): AxiosRequestConfig<T> {
  const token = getCsrfToken();

  if (!token) {
    console.warn(
      "CSRF token not found in cookies. Request may be rejected by the server."
    );
    return config;
  }

  return {
    ...config,
    headers: {
      ...config.headers,
      [CSRF_HEADER_NAME]: token,
    },
  };
}

/**
 * Creates a hidden input field with the CSRF token
 * Use this in forms to include the CSRF token
 *
 * @returns A React element with a hidden input containing the CSRF token
 */
export function CsrfTokenInput(): React.ReactElement | null {
  const token = getCsrfToken();

  if (!token) {
    console.warn(
      "CSRF token not found in cookies. Form submission may be rejected by the server."
    );
    return null;
  }

  return <input type="hidden" name={CSRF_FIELD_NAME} value={token} />;
}
