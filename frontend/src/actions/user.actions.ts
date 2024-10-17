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
  const response = await axiosInstance.patch(
    '/users/update-current',
    user
  );

  return response.data;
}
