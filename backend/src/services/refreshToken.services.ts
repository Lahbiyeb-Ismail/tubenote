import type { RefreshToken } from '@prisma/client';

import prismaClient from '../lib/prisma';
import handleAsyncOperation from '../utils/handleAsyncOperation';

type CreateRefreshTokenProps = {
  userId: string;
  token: string;
};

/**
 * Creates a new refresh token for a user.
 *
 * @param {Object} params - The parameters for creating a refresh token.
 * @param {string} params.userId - The ID of the user for whom the refresh token is being created.
 * @param {string} params.token - The refresh token string.
 * @returns {Promise<RefreshToken>} A promise that resolves to the created refresh token.
 */
export async function createRefreshToken({
  userId,
  token,
}: CreateRefreshTokenProps): Promise<RefreshToken> {
  return handleAsyncOperation(
    () =>
      prismaClient.refreshToken.create({
        data: {
          userId,
          token,
        },
      }),
    { errorMessage: 'Failed to create refresh token.' }
  );
}

/**
 * Finds a refresh token in the database.
 *
 * @param token - The refresh token string to search for.
 * @returns A promise that resolves to the found `RefreshToken` object or `null` if not found.
 */
export async function findRefreshToken(
  token: string
): Promise<RefreshToken | null> {
  return handleAsyncOperation(
    () =>
      prismaClient.refreshToken.findUnique({
        where: {
          token,
        },
      }),
    { errorMessage: 'Failed to find refresh token.' }
  );
}

/**
 * Deletes a refresh token from the database.
 *
 * @param token - The refresh token to be deleted.
 * @returns A promise that resolves when the token is deleted.
 */
export async function deleteRefreshToken(token: string): Promise<void> {
  handleAsyncOperation(
    () =>
      prismaClient.refreshToken.delete({
        where: {
          token,
        },
      }),
    { errorMessage: 'Failed to delete refresh token.' }
  );
}

/**
 * Deletes all refresh tokens associated with a given user ID.
 *
 * @param userId - The ID of the user whose refresh tokens are to be deleted.
 * @returns A promise that resolves when the operation is complete.
 * @throws Will throw an error if the operation fails.
 */
export async function deleteRefreshTokenByUserId(
  userId: string
): Promise<void> {
  handleAsyncOperation(
    () =>
      prismaClient.refreshToken.deleteMany({
        where: {
          userId,
        },
      }),
    { errorMessage: 'Failed to delete refresh token.' }
  );
}
