import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

import { refreshAccessToken } from "@/actions/auth.actions";
import {
  getStorageValue,
  removeStorageValue,
  setStorageValue,
} from "@/utils/localStorage";
import { isTokenExpired } from "@/utils/tokenUtils";

/**
 * Handles the refresh token process by attempting to refresh the access token.
 * If successful, updates the request configuration with the new access token.
 * If the refresh fails, redirects the user to the login page.
 *
 * @param {InternalAxiosRequestConfig} config - The Axios request configuration object.
 * @returns {Promise<void>} A promise that resolves when the token refresh process is complete.
 * @throws Will throw an error if the token refresh process fails.
 */
async function handleRefreshToken(
  config: InternalAxiosRequestConfig
): Promise<void> {
  try {
    const { payload } = await refreshAccessToken();

    setStorageValue("accessToken", payload.data);
    config.headers.Authorization = `Bearer ${payload.data}`;
  } catch (error) {
    // If refresh fails, redirect to login
    removeStorageValue("accessToken");
    window.location.href = "/login";
    throw error;
  }
}

/**
 * Sets up an Axios request interceptor to handle authentication.
 *
 * This interceptor adds the `Authorization` header with a Bearer token
 * to each request if an access token is available and not expired.
 * If the token is expired, it attempts to refresh the token before
 * proceeding with the request.
 *
 * @param instance - The Axios instance to set up the interceptor on.
 */
export function setupRequestInterceptor(instance: AxiosInstance): void {
  instance.interceptors.request.use(
    async (config) => {
      const accessToken = getStorageValue<string>("accessToken");
      if (!accessToken) {
        return config;
      }

      if (isTokenExpired(accessToken)) {
        await handleRefreshToken(config);
      } else {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );
}

/**
 * Sets up an Axios response interceptor to handle authentication errors.
 *
 * This interceptor will automatically attempt to refresh the access token
 * if a 401 Unauthorized error is encountered. If the token refresh is successful,
 * it will retry the original request with the new access token. If
 * the token refresh fails, the user will be redirected to the login page.
 *
 * @param instance - The Axios instance to set up the interceptor on.
 */
export function setupResponseInterceptor(instance: AxiosInstance): void {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const newAccessToken = await refreshAccessToken();
          setStorageValue("accessToken", newAccessToken);

          instance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          return instance(originalRequest);
        } catch (refreshError) {
          removeStorageValue("accessToken");

          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
}
