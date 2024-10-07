import jwt from 'jsonwebtoken';
import envConfig from '../config/envConfig';

/**
 * Generates an access token for a given user ID.
 *
 * @param userId - The unique identifier of the user.
 * @returns A signed JWT access token.
 */
export function createAccessToken(userId: string): string {
  return jwt.sign({ userID: userId }, envConfig.jwt.access_token.secret, {
    expiresIn: envConfig.jwt.access_token.expire,
  });
}

/**
 * Generates a refresh token for a given user.
 *
 * @param userId - The unique identifier of the user for whom the
 * refresh token is being created.
 * @returns A signed JWT refresh token.
 */
export function createRefreshToken(userId: string): string {
  return jwt.sign({ userId }, envConfig.jwt.refresh_token.secret, {
    expiresIn: envConfig.jwt.refresh_token.expire,
  });
}
