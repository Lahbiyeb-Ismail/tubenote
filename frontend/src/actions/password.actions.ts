import axiosInstance from '@/lib/axios.lib';

/**
 * Sends a password reset email to the specified email address.
 *
 * @param email - The email address to send the password reset email to.
 * @returns A promise that resolves to an object containing a message.
 */
export async function sendPasswordResetEmail(
  email: string
): Promise<{ message: string }> {
  const res = await axiosInstance.post('/reset-password', { email });

  return res.data;
}
