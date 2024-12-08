import axiosInstance from "@/lib/axios.lib";

/**
 * Sends a password reset email to the specified email address.
 *
 * @param email - The email address to send the password reset email to.
 * @returns A promise that resolves to an object containing a message.
 */
export async function sendForgotPasswordEmail(
  email: string
): Promise<{ message: string }> {
  const res = await axiosInstance.post("/forgot-password", { email });

  return res.data;
}

/**
 * Resets the user's password using the provided token.
 *
 * @param password - The new password to set for the user.
 * @param token - The token used to authorize the password reset.
 * @returns A promise that resolves to an object containing a message.
 */

type ResetPassword = {
  password: string;
  token: string;
};

export async function resetPassword({
  password,
  token,
}: ResetPassword): Promise<{ message: string }> {
  const res = await axiosInstance.post(`/reset-password/${token}`, {
    password,
  });

  return res.data;
}

/**
 * Verifies the password reset token by making a GET request to the server.
 *
 * @param token - The password reset token to be verified.
 * @returns A promise that resolves to an object containing a message.
 */
export async function verifyPasswordResetToken(
  token: string
): Promise<{ message: string }> {
  const res = await axiosInstance.get(`/reset-password/${token}/verify`);

  return res.data;
}
