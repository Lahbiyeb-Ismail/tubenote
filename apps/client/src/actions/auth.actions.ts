import axios from "axios";

import axiosInstance from "@/lib/axios.lib";

import type { ILoginDto, IRegisterDto } from "@tubenote/dtos";
import type { IApiResponse, User } from "@tubenote/types";

import { API_URL } from "@/utils/constants";
import { setStorageValue } from "@/utils/localStorage";

/**
 * Registers a new user with the provided registration credentials.
 *
 * @param registerDto - The registration data required to create a new user.
 * @returns A promise that resolves to the registration response.
 */
export async function registerUser(
  registerDto: IRegisterDto
): Promise<{ message: string; email: string }> {
  const { data: responseData } = await axios.post<IApiResponse<User>>(
    `${API_URL}/auth/register`,
    registerDto
  );

  if (!responseData.success || !responseData.data) {
    throw new Error("Registration failed");
  }

  const { message, data } = responseData;

  return { message, email: data.email };
}

/**
 * Logs in a user with the provided login credentials.
 *
 * @param loginDto - The login form data containing user credentials.
 * @returns A promise that resolves to the login response.
 */
export async function loginUser(
  loginDto: ILoginDto
): Promise<{ message: string; accessToken: string }> {
  try {
    const { data: responseData } = await axios.post<
      IApiResponse<{ accessToken: string }>
    >(`${API_URL}/auth/login`, loginDto, {
      withCredentials: true,
    });

    console.log(responseData);

    if (!responseData.success || !responseData.data) {
      throw new Error("Login failed");
    }

    const { message, data } = responseData;

    return { message, accessToken: data.accessToken };
  } catch (error) {
    console.error("Error logging in:", error);
    throw new Error("Login failed");
  }
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
export async function logoutUser(): Promise<void> {
  await axiosInstance.post(`${API_URL}/auth/logout`);
}

/**
 * Refreshes the access token by making a POST request to the refresh endpoint.
 *
 * @returns {Promise<void>} A promise that resolves when the access token is refreshed.
 *
 * @throws Will log an error message if the token refresh fails.
 */
export async function refreshAccessToken(): Promise<string | void> {
  try {
    const response = await axios.post<IApiResponse<{ accessToken: string }>>(
      `${API_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error("Token refresh failed");
    }

    const { data } = response.data;

    const newAccessToken = data.accessToken;

    setStorageValue("accessToken", newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
  }
}

/**
 * Exchanges a Oauth authorization code for an access token.
 *
 * @param code - The Oauth authorization code to exchange.
 * @returns A promise that resolves to the access token as a string.
 */
export async function exchangeOauthCodeForAuthTokens(
  code: string
): Promise<string> {
  const response = await axios.post(
    `${API_URL}/oauth/exchange-oauth-code`,
    { code },
    { withCredentials: true }
  );

  return response.data.accessToken;
}
