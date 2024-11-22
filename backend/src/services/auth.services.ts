import type { Prisma, User } from '@prisma/client';

import prismaClient from '../lib/prisma';
import handleAsyncOperation from '../utils/handleAsyncOperation';
import { hashPassword } from '../helpers/auth.helper';

/**
 * Creates a new user in the database with the provided user data.
 * The user's password is hashed before being stored.
 *
 * @param {Prisma.UserCreateInput} userData - The data for the new user, including the password.
 * @returns {Promise<Prisma.User>} The newly created user.
 */
export async function createNewUser(
  userData: Prisma.UserCreateInput
): Promise<User> {
  const hashedpassword = await hashPassword(userData.password);

  return handleAsyncOperation(
    () =>
      prismaClient.user.create({
        data: {
          ...userData,
          password: hashedpassword,
        },
      }),
    { errorMessage: 'Failed to create new user.' }
  );
}
