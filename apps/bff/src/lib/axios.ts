import type { AxiosError } from "axios";

import { envConfig } from "@/config";
import { AuthService } from "@/modules/auth";
import axios from "axios";

/**
 * Axios instance configured for backend API communication.
 *
 * This instance is pre-configured with:
 * - Base URL from environment configuration
 * - Credentials included in cross-origin requests
 *
 * @example
 * ```typescript
 * // Use for API calls
 * const response = await axiosInstance.get('/users');
 * const userData = await axiosInstance.post('/auth/login', credentials);
 * ```
 */
const axiosInstance = axios.create({
  baseURL: envConfig.backend_api.url,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Check if the error is due to an expired access token (e.g., status 401)
    // and if we haven't already tried to refresh the token for this request.
    if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
      (originalRequest as any)._retry = true;

      console.log("Access token expired, attempting to refresh...");

      try {
        const authService = new AuthService();
        /**
         * Extracts the session identifier from the request headers.
         * This session ID is used by the interceptor to track user sessions
         * and maintain authentication state across API requests.
         *
         * @remarks
         * The session ID is expected to be passed in the "X-Session-ID" header
         * by the client and is used for session management and request correlation.
         */
        const sessionId = originalRequest.headers["X-Session-ID"] as string;

        console.log("Session ID for refresh:", sessionId);

        if (!sessionId) {
          return Promise.reject(error);
        }

        // Attempt to refresh the token
        const { accessToken } = await authService.refresh(sessionId);

        if (accessToken) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          // Retry the original request with the new token
          return axiosInstance(originalRequest);
        }
      }
      catch (refreshError) {
        // If the refresh token is also invalid, log the user out
        const authService = new AuthService();
        const sessionId = originalRequest.headers["X-Session-ID"] as string;

        if (sessionId) {
          await authService.logout(sessionId);
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export { axiosInstance };
