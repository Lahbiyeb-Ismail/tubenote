import type { AxiosError } from "axios";

import type { IApiErrorResponse, IApiSuccessResponse } from "@tubenote/types";
import { asyncTryCatch } from "@tubenote/utils";

import axiosInstance from "@/lib/axios.lib";

/**
 * Sends an verification email request to the server.
 *
 * @param email - The email address to which the verification email will be sent.
 * @returns A promise that resolves to an object containing a message.
 */
export async function sendVerificationEmail(
  email: string
): Promise<IApiSuccessResponse<null>> {
  const { data: response, error } = await asyncTryCatch(
    axiosInstance.post<IApiSuccessResponse<null>>("/send-verification-email", {
      email,
    })
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
