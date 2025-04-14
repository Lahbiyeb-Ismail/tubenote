import axios, { type AxiosError } from "axios";

import axiosInstance from "@/lib/axios.lib";

import type { ILoginDto, IRegisterDto } from "@tubenote/dtos";
import type { IApiErrorResponse, IApiSuccessResponse } from "@tubenote/types";
import { asyncTryCatch } from "@tubenote/utils";

import { API_URL } from "@/utils/constants";

/**
 * Registers a new user with the provided registration credentials.
 *
 * @param registerDto - The registration data required to create a new user.
 * @returns A promise that resolves to the registration response.
 */
export async function registerUser(
  registerDto: IRegisterDto
): Promise<IApiSuccessResponse<string>> {
  const { data: responseData, error } = await asyncTryCatch(
    axios.post<IApiSuccessResponse<string>>(
      `${API_URL}/auth/register`,
      registerDto
    )
  );

  if (error) {
    const axiosError = error as AxiosError<IApiErrorResponse>;
    if (axiosError.response) {
      throw new Error(axiosError.response.data.payload.message);
    } else {
      throw new Error("Registration failed. Please try again.");
    }
  }

  return responseData.data;
}

/**
 * Logs in a user with the provided login credentials.
 *
 * @param loginDto - The login form data containing user credentials.
 * @returns A promise that resolves to the login response.
 */
export async function loginUser(
  loginDto: ILoginDto
): Promise<IApiSuccessResponse<string>> {
  const { data: responseData, error } = await asyncTryCatch(
    axios.post<IApiSuccessResponse<string>>(`${API_URL}/auth/login`, loginDto, {
      withCredentials: true,
    })
  );

  if (error) {
    const axiosError = error as AxiosError<IApiErrorResponse>;
    if (axiosError.response) {
      throw new Error(axiosError.response.data.payload.message);
    } else {
      throw new Error("Login failed. Please try again.");
    }
  }

  return responseData.data;
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
  const { data: responseData, error } = await asyncTryCatch(
    axiosInstance.post<IApiSuccessResponse<null>>(`${API_URL}/auth/logout`)
  );

  if (error) {
    const axiosError = error as AxiosError<IApiErrorResponse>;
    if (axiosError.response) {
      throw new Error(axiosError.response.data.payload.message);
    } else {
      throw new Error("Logout failed. Please try again.");
    }
  }

  return responseData.data;
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
  const { data: responseData, error } = await asyncTryCatch(
    axios.post<IApiSuccessResponse<string>>(
      `${API_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    )
  );

  if (error) {
    const axiosError = error as AxiosError<IApiErrorResponse>;
    if (axiosError.response) {
      throw new Error(axiosError.response.data.payload.message);
    } else {
      throw new Error("Logout failed. Please try again.");
    }
  }

  return responseData.data;
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
