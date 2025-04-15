import type { AxiosError } from "axios";

import type { IApiErrorResponse, IApiSuccessResponse } from "@tubenote/types";
import { asyncTryCatch } from "@tubenote/utils";

import axiosInstance from "@/lib/axios.lib";

/**
 * Sends a password reset email to the specified email address.
 *
 * @param email - The email address to send the password reset email to.
 * @returns A promise that resolves to an object containing a message.
 */
export async function sendForgotPasswordEmail(
  email: string
): Promise<IApiSuccessResponse<null>> {
  const { data: response, error } = await asyncTryCatch(
    axiosInstance.post<IApiSuccessResponse<null>>("/auth/forgot-password", {
      email,
    })
  );

  if (error) {
    const axiosError = error as AxiosError<IApiErrorResponse>;

    if (axiosError.response) {
      const { status, data } = axiosError.response;
      throw new Error(`Error ${status}: ${data.payload.message}`);
    } else {
      throw new Error("Network error: Unable to send password reset email.");
    }
  }
  return response.data;
}

/**
 * Resets the user's password using the provided token.
 *
 * @param password - The new password to set for the user.
 * @param token - The token used to authorize the password reset.
 * @returns A promise that resolves to an object containing a message.
 */
export async function resetPassword(
  token: string,
  password: string
): Promise<IApiSuccessResponse<null>> {
  const { data: response, error } = await asyncTryCatch(
    axiosInstance.post<IApiSuccessResponse<null>>(
      `/auth/reset-password/${token}`,
      {
        password,
      }
    )
  );

  if (error) {
    const axiosError = error as AxiosError<IApiErrorResponse>;

    if (axiosError.response) {
      const { status, data } = axiosError.response;
      throw new Error(`Error ${status}: ${data.payload.message}`);
    } else {
      throw new Error("Network error: Unable to reset password.");
    }
  }

  return response.data;
}

/**
 * Verifies the password reset token by making a GET request to the server.
 *
 * @param token - The password reset token to be verified.
 * @returns A promise that resolves to an object containing a message.
 */
export async function verifyPasswordResetToken(
  token: string
): Promise<IApiSuccessResponse<null>> {
  const { data: response, error } = await asyncTryCatch(
    axiosInstance.get<IApiSuccessResponse<null>>(
      `/auth/reset-password/${token}/verify`
    )
  );

  if (error) {
    const axiosError = error as AxiosError<IApiErrorResponse>;

    if (axiosError.response) {
      const { status, data } = axiosError.response;
      throw new Error(`Error ${status}: ${data.payload.message}`);
    } else {
      throw new Error("Network error: Unable to verify password reset token.");
    }
  }

  return response.data;
}
