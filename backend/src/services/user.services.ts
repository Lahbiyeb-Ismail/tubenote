import prismaClient from '../lib/prisma';
import type { Prisma, User } from '@prisma/client';

/**
 * Finds a user based on the provided parameters.
 *
 * @param params - The parameters to filter the user by.
 * @returns A promise that resolves to the found user or null if no user is found.
 */
export async function findUser(
  params: Prisma.UserWhereInput
): Promise<User | null> {
  const user = await prismaClient.user.findFirst({
    where: {
      ...params,
    },
  });

  return user;
}

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
