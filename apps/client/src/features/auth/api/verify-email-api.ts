import type { IApiSuccessResponse } from "@tubenote/types";

import { axiosInstance } from "@/shared/lib";

/**
 * Sends an verification email request to the server.
 *
 * @param email - The email address to which the verification email will be sent.
 * @returns A promise that resolves to an object containing a message.
 */
export async function sendVerificationEmail(
  email: string,
): Promise<IApiSuccessResponse<null>> {
  const response = await axiosInstance.post<IApiSuccessResponse<null>>("/send-verification-email", {
    email,
  });

  return response.data;
}
