import type { ILoginDto, IRegisterDto } from "@tubenote/dtos";
import type { IApiSuccessResponse } from "@tubenote/types";

import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import { envConfig } from "@/config";
import { axiosInstance } from "@/lib/axios";
import { sessionCacheService } from "@/services";

/**
 * Service class for handling authentication operations including user registration,
 * login, logout, and token refresh functionality.
 *
 * This service manages user sessions through a cache system and communicates
 * with the backend authentication API to handle JWT tokens.
 */
export class AuthService {
  /**
   * Registers a new user with the provided credentials.
   *
   * @param credentials - The registration data containing user information
   * @returns A promise that resolves to an API success response with a string payload
   * @throws Will throw an error if the registration request fails
   */
  async register(credentials: IRegisterDto): Promise<IApiSuccessResponse<string>> {
    const registerRes = await axiosInstance.post<IApiSuccessResponse<string>>(`/auth/register`, credentials);

    return registerRes.data;
  }

  /**
   * Authenticates a user with the provided login credentials and creates a new session.
   *
   * The method exchanges user credentials for authentication tokens, stores them in a
   * session cache, and returns a session ID along with sanitized response data.
   *
   * @param credentials - The login credentials (username/email and password)
   * @returns A promise that resolves to an object containing the session ID and API response with null payload
   * @throws Will throw an error if the login request fails
   */
  async login(credentials: ILoginDto): Promise<{ sessionId: string; data: IApiSuccessResponse<null> }> {
    const loginRes = await axiosInstance.post<IApiSuccessResponse<{ accessToken: string; refreshToken: string }>>(`/auth/login`, credentials);

    const authTokens = loginRes.data.payload.data;

    const sessionId = uuidv4();

    await sessionCacheService.createSession(sessionId, authTokens, 60 * 60 * 24 * 1000); // 24 hours

    return { sessionId, data: {
      ...loginRes.data,
      payload: {
        ...loginRes.data.payload,
        data: null,
      },
    } };
  }

  /**
   * Logs out a user by invalidating their session and revoking their tokens.
   *
   * This method retrieves the session data, calls the backend logout endpoint
   * to revoke the refresh token, and removes the session from the cache.
   *
   * @param sessionId - The unique session identifier
   * @returns A promise that resolves to an API success response with null payload
   * @throws Will throw an error if the user is not logged in or if the logout request fails
   */
  async logout(sessionId: string): Promise<IApiSuccessResponse<null>> {
    const sessionData = await sessionCacheService.getSession(sessionId);

    if (!sessionData || !sessionData.refreshToken) {
      throw new Error("You must be logged in to refresh");
    }

    const logoutRes = await axiosInstance.post<IApiSuccessResponse<null>>(`${envConfig.backend_api.url}/auth/logout`, { refreshToken: sessionData.refreshToken }, {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionId,
      },
    });

    await sessionCacheService.deleteSession(sessionId);

    return logoutRes.data;
  }

  /**
   * Refreshes the authentication tokens for an active session.
   *
   * This method uses the stored refresh token to obtain new access and refresh tokens
   * from the backend API, then updates the session cache with the new tokens.
   *
   * @param sessionId - The unique session identifier
   * @returns A promise that resolves to an object containing the session ID and new access token
   * @throws Will throw an error if the user is not logged in or if the refresh request fails
   */
  async refresh(sessionId: string): Promise<{ sessionId: string; accessToken: string }> {
    const sessionData = await sessionCacheService.getSession(sessionId);

    if (!sessionData || !sessionData.refreshToken) {
      throw new Error("You must be logged in to refresh");
    }

    // Call backend API to refresh tokens
    const refreshRes = await axios.post<IApiSuccessResponse<{ accessToken: string; refreshToken: string }>>(`${envConfig.backend_api.url}/auth/refresh`, {}, {
      headers: {
        Authorization: `Bearer ${sessionData.refreshToken}`,
      },
      withCredentials: true,
    });

    const newAuthTokens = refreshRes.data.payload.data;

    await sessionCacheService.createSession(sessionId, newAuthTokens, 60 * 60 * 24 * 1000); // 24 hours

    return { sessionId, accessToken: newAuthTokens.accessToken };
  }
}
