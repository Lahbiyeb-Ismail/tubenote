import axios from "axios";

import axiosInstance from "@/lib/axios.lib";
import type {
  LoginFormData,
  LoginUserResponse,
  RegisterFormData,
  RegisterUserResponse,
} from "@/types/auth.types";

import { API_URL } from "@/utils/constants";
import { setStorageValue } from "@/utils/localStorage";

/**
 * Registers a new user with the provided registration credentials.
 *
 * @param registerCredentials - The registration data required to create a new user.
 * @returns A promise that resolves to the registration response.
 */
export async function registerUser(
  registerCredentials: RegisterFormData
): Promise<RegisterUserResponse> {
  const response = await axios.post(
    `${API_URL}/auth/register`,
    registerCredentials
  );

  return response.data;
}

/**
 * Logs in a user with the provided login credentials.
 *
 * @param loginCredentials - The login form data containing user credentials.
 * @returns A promise that resolves to the login response.
 */
export async function loginUser(
  loginCredentials: LoginFormData
): Promise<LoginUserResponse> {
  const response = await axios.post(`${API_URL}/auth/login`, loginCredentials, {
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
export async function refreshAccessToken(): Promise<void> {
  try {
    const response = await axios.post(
      `${API_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    );
    const newAccessToken = response.data.accessToken;
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
    `${API_URL}/auth/exchange-oauth-code`,
    { code },
    { withCredentials: true }
  );

  return response.data.accessToken;
}
