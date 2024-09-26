import type { Response } from 'express';
import bcrypt from 'bcryptjs';

import type { User } from '@prisma/client';
import prismaClient from '../lib/prismaDB';
import config from '../config';
import {
  clearRefreshTokenCookieConfig,
  refreshTokenCookieConfig,
} from '../config/cookie.config';
import { createAccessToken, createRefreshToken } from '../utils/generateTokens';

/**
 * Checks if a user with the given email exists.
 * @param email - The email of the user to check.
 * @returns The user object if found, otherwise undefined.
 */
export const userExists = async (email: string): Promise<User | null> => {
  const user = await prismaClient.user.findUnique({
    where: {
      email,
    },
  });

  return user;
};

interface UserCredentials {
  username: string;
  email: string;
  password: string;
}

export const createNewUser = async (
  userCredentials: UserCredentials,
): Promise<User> => {
  const { username, email, password } = userCredentials;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prismaClient.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  return newUser;
};

export const passwordMatches = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Handles the existing refresh token.
 *
 * If there is a refresh token in the request cookie, this function checks if the token exists in the database
 * and belongs to the current user. If it does, the token is deleted. If the token does not exist or belongs to
 * another user, all refresh tokens of the user stored in the database are deleted for safety. The function also
 * clears the cookie in both cases.
 *
 * @param refreshToken - The refresh token from the request cookie.
 * @param userId - The ID of the current user.
 * @param res - The response object.
 * @returns A promise that resolves when the refresh token is handled.
 */
export const handleExistingRefreshToken = async (
  refreshToken: string,
  userId: string,
  res: Response,
): Promise<void> => {
  // check if the given refresh token is from the current user
  const RefreshTokenFromDB = await prismaClient.refreshToken.findUnique({
    where: {
      token: refreshToken,
    },
  });

  // if this token does not exists in the database or belongs to another user,
  // then we clear all refresh tokens from the user in the db
  if (!RefreshTokenFromDB || RefreshTokenFromDB.userId !== userId) {
    await prismaClient.refreshToken.deleteMany({
      where: {
        userId,
      },
    });
  } else {
    // else everything is fine and we just need to delete the one token
    await prismaClient.refreshToken.delete({
      where: {
        token: refreshToken,
      },
    });
  }

  // Clear the refresh token from the cookie
  res.clearCookie(
    config.jwt.refresh_token.cookie_name,
    clearRefreshTokenCookieConfig,
  );
};

/**
 * Creates and saves new tokens for the specified user.
 *
 * @param userId - The ID of the user.
 * @param res - The response object.
 * @returns The access token.
 */
export const createAndSaveNewTokens = async (
  userId: string,
  res: Response,
): Promise<string> => {
  // Create new access token
  const accessToken = createAccessToken(userId);

  // Create new refresh token
  const newRefreshToken = createRefreshToken(userId);

  // Save the new refresh token in db
  await prismaClient.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId,
    },
  });

  // Set the new refresh token in a cookie
  res.cookie(
    config.jwt.refresh_token.cookie_name,
    newRefreshToken,
    refreshTokenCookieConfig,
  );

  return accessToken;
};

export const getRefreshTokenFromDB = async (refreshToken: string) => {
  return prismaClient.refreshToken.findUnique({
    where: { token: refreshToken },
  });
};

export const deleteRefreshTokenFromDB = async (refreshToken: string) => {
  return prismaClient.refreshToken.delete({
    where: { token: refreshToken },
  });
};
