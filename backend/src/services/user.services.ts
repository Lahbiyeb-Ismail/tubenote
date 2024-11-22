import type { Prisma, User } from '@prisma/client';

import prismaClient from '../lib/prisma';
import handleAsyncOperation from '../utils/handleAsyncOperation';

/**
 * Finds a user based on the provided parameters.
 *
 * @param params - The parameters to filter the user by.
 * @returns A promise that resolves to the found user or null if no user is found.
 */
export async function findUser(
  params: Prisma.UserWhereInput
): Promise<User | null> {
  const user = handleAsyncOperation(
    () =>
      prismaClient.user.findFirst({
        where: {
          ...params,
        },
      }),
    { errorMessage: 'Failed to find user.' }
  );

  return user;
}

/**
 * Verifies the email of a user by updating the `emailVerified` field to `true`.
 *
 * @param userId - The unique identifier of the user whose email is to be verified.
 * @returns A promise that resolves when the user's email verification status has been updated.
 */
export async function verifyUserEmail(userId: string): Promise<void> {
  handleAsyncOperation(
    () =>
      prismaClient.user.update({
        where: { id: userId },
        data: { emailVerified: true },
      }),
    { errorMessage: 'Failed to verify user email.' }
  );
}

type UpdateUserProps = {
  userId: string;
  data: Prisma.UserUpdateInput;
};

/**
 * Updates a user in the database with the provided data.
 *
 * @param {UpdateUserProps} params - The parameters for updating the user.
 * @param {string} params.userId - The ID of the user to update.
 * @param {Partial<User>} params.data - The data to update the user with.
 * @returns {Promise<User>} A promise that resolves to the updated user.
 */
export async function updateUser({
  userId,
  data,
}: UpdateUserProps): Promise<User> {
  return handleAsyncOperation(
    () =>
      prismaClient.user.update({
        where: { id: userId },
        data,
      }),
    { errorMessage: 'Failed to update user.' }
  );
}
