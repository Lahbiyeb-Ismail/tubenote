import type { ILoginDto, IRegisterDto } from "@tubenote/dtos";
import type { IApiSuccessResponse } from "@tubenote/types";

import { API_URL } from "@/shared/constants";
import { axiosInstance } from "@/shared/lib";

/**
 * Registers a new user with the provided registration credentials.
 *
 * @param registerDto - The registration data required to create a new user.
 * @returns A promise that resolves to the registration response.
 */
export async function registerUser(
  registerDto: IRegisterDto,
): Promise<IApiSuccessResponse<string>> {
  const response = await axiosInstance.post<IApiSuccessResponse<string>>(
    `${API_URL}/auth/register`,
    registerDto,
  );

  return response.data;
}

/**
 * Logs in a user with the provided login credentials.
 *
 * @param loginDto - The login form data containing user credentials.
 * @returns A promise that resolves to the login response.
 */
export async function loginUser(
  loginDto: ILoginDto,
): Promise<IApiSuccessResponse<string>> {
  const response = await axiosInstance.post<IApiSuccessResponse<string>>(`${API_URL}/auth/login`, loginDto, {
    withCredentials: true,
  });

  return response.data;
}

/**
 * Logs out the currently authenticated user by making a POST request
 * to the logout endpoint.
 *
 * @async
 * @function logoutUser
 * @returns {Promise<void>} A promise that resolves when the logout request
 * is complete.
 */
export async function logoutUser(): Promise<IApiSuccessResponse<null>> {
  const response = await axiosInstance.post<IApiSuccessResponse<null>>(`${API_URL}/auth/logout`);

  return response.data;
}

/**
 * Refreshes the access token by making a POST request to the refresh endpoint.
 *
 * @returns {Promise<void>} A promise that resolves when the access token is refreshed.
 *
 * @throws Will log an error message if the token refresh fails.
 */
export async function refreshAccessToken(): Promise<
  IApiSuccessResponse<string>
> {
  const response = await axiosInstance.post<IApiSuccessResponse<string>>(
    `${API_URL}/auth/refresh`,
  );

  return response.data;
}

/**
 * Exchanges a Oauth authorization code for an access token.
 *
 * @param code - The Oauth authorization code to exchange.
 * @returns A promise that resolves to the access token as a string.
 */
export async function exchangeOauthCodeForAuthTokens(
  code: string,
): Promise<IApiSuccessResponse<string>> {
  const response = await axiosInstance.post<IApiSuccessResponse<string>>(
    `${API_URL}/oauth/exchange-oauth-code`,
    { code },
  );

  return response.data;
}
