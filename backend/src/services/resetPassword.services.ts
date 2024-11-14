import { randomUUID } from 'node:crypto';

import prismaClient from '../lib/prisma';

/**
 * Checks if there is a valid (not expired) reset password token for the given user ID.
 *
 * @param userId - The unique identifier of the user.
 * @returns A promise that resolves to `true` if a valid reset password token exists, otherwise `false`.
 */
export async function getResetPasswordToken(userId: string): Promise<boolean> {
  const resetPasswordToken = await prismaClient.resetPasswordToken.findFirst({
    where: {
      userId,
      expiresAt: { gt: new Date() },
    },
  });

  return !!resetPasswordToken;
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

  await prismaClient.resetPasswordToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return token;
}
