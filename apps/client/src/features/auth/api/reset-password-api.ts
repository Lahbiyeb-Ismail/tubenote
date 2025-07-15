import type { IApiSuccessResponse } from "@tubenote/types";

import { axiosInstance } from "@/shared/lib";

/**
 * Sends a password reset email to the specified email address.
 *
 * @param email - The email address to send the password reset email to.
 * @returns A promise that resolves to an object containing a message.
 */
export async function sendForgotPasswordEmail(
  email: string,
): Promise<IApiSuccessResponse<null>> {
  const response = await axiosInstance.post<IApiSuccessResponse<null>>("/auth/forgot-password", {
    email,
  });

  return response.data;
}

/**
 * Resets a user's password using a password reset token.
 *
 * @param params - The parameters for resetting the password
 * @param params.token - The password reset token received via email or other secure channel
 * @param params.password - The new password to set for the user account
 *
 * @returns A promise that resolves to an API success response with null data
 *
 * @throws Will throw an error if the token is invalid, expired, or if the API request fails
 *
 */
export async function resetPassword({
  token,
  password,
}: { token: string; password: string }): Promise<IApiSuccessResponse<null>> {
  const response = await axiosInstance.post<IApiSuccessResponse<null>>(
    `/auth/reset-password/${token}`,
    {
      password,
    },
  );

  return response.data;
}

/**
 * Verifies the password reset token by making a GET request to the server.
 *
 * @param token - The password reset token to be verified.
 * @returns A promise that resolves to an object containing a message.
 */
export async function verifyPasswordResetToken(
  token: string,
): Promise<IApiSuccessResponse<null>> {
  const response = await axiosInstance.get<IApiSuccessResponse<null>>(
    `/auth/reset-password/${token}/verify`,
  );

  return response.data;
}
