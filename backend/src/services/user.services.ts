import prismaClient from '../lib/prisma';
import type { User } from '@prisma/client';

/**
 * Verifies the email of a user by updating the `emailVerified` field to `true`.
 *
 * @param userId - The unique identifier of the user whose email is to be verified.
 * @returns A promise that resolves when the user's email verification status has been updated.
 */
export async function verifyUserEmail(userId: string) {
  await prismaClient.user.update({
    where: { id: userId },
    data: { emailVerified: true },
  });
}

/**
 * Updates a user with the given data.
 *
 * @param userId - The ID of the user to update.
 * @param data - The data to update the user with.
 * @returns A promise that resolves to the updated user.
 */

type UpdateUserInput = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>;

export async function updateUser(
  userId: string,
  data: UpdateUserInput
): Promise<User> {
  const updatedUser = await prismaClient.user.update({
    where: { id: userId },
    data,
  });

  return updatedUser;
}
