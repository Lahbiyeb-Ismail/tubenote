import { randomUUID } from 'node:crypto';
import type { EmailVerificationToken } from '@prisma/client';

import prismaClient from '../lib/prisma';
import handleAsyncOperation from '../utils/handleAsyncOperation';

/**
 * Retrieves the email verification token for a given user if it exists and is not expired.
 *
 * @param userId - The unique identifier of the user.
 * @returns A promise that resolves to the email verification token if found and valid, or null if not found or expired.
 * @throws Will throw an error if the operation fails.
 */
export async function getEmailVericationToken(
  userId: string
): Promise<EmailVerificationToken | null> {
  return handleAsyncOperation(
    () =>
      prismaClient.emailVerificationToken.findFirst({
        where: {
          user: { id: userId },
          expiresAt: { gt: new Date() },
        },
      }),
    { errorMessage: 'Failed to get email verification token.' }
  );
}

/**
 * Creates an email verification token for a given user.
 *
 * @param userId - The ID of the user for whom the email verification token is being created.
 * @returns A promise that resolves to the generated email verification token as a string.
 *
 * The token is generated using `randomUUID()` and is set to expire in 1 hour.
 * The token, expiration time, and user ID are stored in the `emailVerificationToken` table in the database.
 */
export async function createEmailVericationToken(
  userId: string
): Promise<string> {
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 3600000); // Token expires in 1 hour

  handleAsyncOperation(
    () =>
      prismaClient.emailVerificationToken.create({
        data: {
          token,
          expiresAt,
          userId,
        },
      }),
    { errorMessage: 'Failed to create email verification token.' }
  );

  return token;
}

/**
 * Deletes all email verification tokens associated with a given user ID.
 *
 * @param userId - The ID of the user whose email verification tokens are to be deleted.
 * @returns A promise that resolves when the tokens have been deleted.
 * @throws Will throw an error if the deletion fails.
 */
export async function deleteEmailVericationToken(
  userId: string
): Promise<void> {
  handleAsyncOperation(
    () =>
      prismaClient.emailVerificationToken.deleteMany({
        where: { userId },
      }),
    { errorMessage: 'Failed to delete email verification token.' }
  );
}

/**
 * Finds an email verification token in the database.
 *
 * @param token - The verification token to search for.
 * @returns A promise that resolves to the found EmailVerificationToken object or null if not found.
 * @throws Will throw an error if the operation fails.
 */
export async function findVerificationToken(
  token: string
): Promise<EmailVerificationToken | null> {
  return handleAsyncOperation(
    () =>
      prismaClient.emailVerificationToken.findUnique({
        where: { token },
      }),
    { errorMessage: 'Failed to find verification token.' }
  );
}
