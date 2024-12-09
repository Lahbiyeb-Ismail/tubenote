import axiosInstance from "@/lib/axios.lib";

/**
 * Sends an email verification request to the server.
 *
 * @param email - The email address to which the verification email will be sent.
 * @returns A promise that resolves to an object containing a message.
 */
export async function sendEmailVerification(
  email: string
): Promise<{ message: string }> {
  const res = await axiosInstance.post("/send-verification-email", { email });

  return res.data;
}
