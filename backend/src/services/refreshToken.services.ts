import { Prisma, type RefreshToken } from '@prisma/client';
import prismaClient from '../lib/prisma';
import handleAsyncOperation from '../utils/handleAsyncOperation';

interface CreateRefreshTokenProps {
  userId: string;
  token: string;
}

/**
 * Creates a new refresh token for a user.
 *
 * @param {CreateRefreshTokenProps} params - The parameters for creating a refresh token.
 * @returns {Promise<RefreshToken>} A promise that resolves to the created refresh token.
 */
export async function createRefreshToken({
  userId,
  token,
}: CreateRefreshTokenProps): Promise<RefreshToken> {
  return handleAsyncOperation(
    () =>
      prismaClient.refreshToken.create({
        data: { userId, token },
      }),
    { errorMessage: 'Failed to create refresh token' }
  );
}

/**
 * Finds a refresh token in the database.
 *
 * @param {string} token - The refresh token string to search for.
 * @returns {Promise<RefreshToken | null>} A promise that resolves to the found RefreshToken object or null if not found.
 */
export async function findRefreshToken(
  token: string
): Promise<RefreshToken | null> {
  return handleAsyncOperation(
    () =>
      prismaClient.refreshToken.findUnique({
        where: { token },
      }),
    { errorMessage: 'Failed to find refresh token' }
  );
}

/**
 * Deletes a refresh token from the database.
 *
 * @param {string} token - The refresh token to be deleted.
 * @returns {Promise<boolean>} A promise that resolves to true if the token was deleted, false if it wasn't found.
 */
export async function deleteRefreshToken(token: string): Promise<boolean> {
  try {
    await handleAsyncOperation(
      () =>
        prismaClient.refreshToken.delete({
          where: { token },
        }),
      { errorMessage: 'Failed to delete refresh token' }
    );
    return true;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      // Record not found, which is fine in this case
      return false;
    }
    // Re-throw other errors
    throw error;
  }
}

/**
 * Deletes all refresh tokens associated with a given user ID.
 *
 * @param {string} userId - The ID of the user whose refresh tokens are to be deleted.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
export async function deleteRefreshTokenByUserId(
  userId: string
): Promise<void> {
  await handleAsyncOperation(
    () =>
      prismaClient.refreshToken.deleteMany({
        where: { userId },
      }),
    { errorMessage: 'Failed to delete refresh tokens for user' }
  );
}
