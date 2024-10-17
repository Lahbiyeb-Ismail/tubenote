import axiosInstance from '@/lib/axios.lib';
import type { User } from '@/types/auth.types';

/**
 * Updates the current user's information.
 *
 * @param {User} user - The user object containing updated information.
 * @returns {Promise<User>} A promise that resolves to the updated user object.
 */
export async function updateCurrentUser(
  user: User
): Promise<{ user: User; message: string }> {
  const response = await axiosInstance.patch('/users/update-current', user);

  return response.data;
}

type UpdatePassword = {
  currentPassword: string;
  newPassword: string;
};

/**
 * Updates the user's password.
 *
 * @param {Object} params - The parameters for updating the password.
 * @param {string} params.currentPassword - The user's current password.
 * @param {string} params.newPassword - The new password to set.
 * @returns {Promise<{ message: string; user: User }>} A promise that resolves
 * to an object containing a message and the updated user information.
 */
export async function updatePassword({
  currentPassword,
  newPassword,
}: UpdatePassword): Promise<{ message: string; user: User }> {
  const response = await axiosInstance.patch('/users/update-password', {
    currentPassword,
    newPassword,
  });

  return response.data;
}
