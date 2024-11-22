import { randomUUID } from 'node:crypto';
import type { ResetPasswordToken, Prisma } from '@prisma/client';

import prismaClient from '../lib/prisma';
import handleAsyncOperation from '../utils/handleAsyncOperation';

/**
 * Finds a reset password token that matches the given parameters and is not expired.
 *
 * @param params - The parameters to filter the reset password tokens.
 * @returns A promise that resolves to the reset password token if found, or null if not found.
 */
export async function findResetPasswordToken(
  params: Prisma.ResetPasswordTokenWhereInput
): Promise<ResetPasswordToken | null> {
  return handleAsyncOperation(
    () =>
      prismaClient.resetPasswordToken.findFirst({
        where: {
          ...params,
          expiresAt: { gt: new Date() },
        },
      }),
    { errorMessage: 'Failed to find reset password token.' }
  );
}

/**
 * Creates a reset password token for the specified user.
 *
 * Generates a unique token and sets an expiration time of 1 hour from the current time.
 * The token and its expiration are stored in the database associated with the user's ID.
 *
 * @param userId - The ID of the user requesting a password reset.
 * @returns A promise that resolves to the generated reset password token.
 */
export async function createResetPasswordToken(
  userId: string
): Promise<string> {
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 3600000); // Token expires in 1 hour

  handleAsyncOperation(
    () =>
      prismaClient.resetPasswordToken.create({
        data: {
          token,
          userId,
          expiresAt,
        },
      }),
    { errorMessage: 'Failed to create reset password token.' }
  );

  return token;
}

/**
 * Deletes all reset password tokens associated with a given user ID.
 *
 * @param userId - The ID of the user whose reset password tokens are to be deleted.
 * @returns A promise that resolves when the tokens have been deleted.
 */
export async function deleteResetPasswordToken(userId: string): Promise<void> {
  handleAsyncOperation(
    () =>
      prismaClient.resetPasswordToken.deleteMany({
        where: {
          userId,
        },
      }),
    { errorMessage: 'Failed to delete reset password tokens.' }
  );
}
