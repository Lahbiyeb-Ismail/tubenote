import type { RefreshToken } from '@prisma/client';
import prismaClient from '../lib/prisma';

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
  const refreshToken = await prismaClient.refreshToken.create({
    data: {
      userId,
      token,
    },
  });

  return refreshToken;
}
