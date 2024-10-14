import bcrypt from 'bcryptjs';
import type { Response } from 'express';
import type { User } from '@prisma/client';

import prismaClient from '../lib/prisma';
import { createAccessToken, createRefreshToken } from './generateTokens';
import envConfig from '../config/envConfig';
import { refreshTokenCookieConfig } from '../config/cookie.config';

import type { RegisterCredentiels } from '../types/auth.type';

const REFRESH_TOKEN_NAME = envConfig.jwt.refresh_token.cookie_name;

/**
 * Checks if a user exists in the database by their email.
 *
 * @param email - The email of the user to check.
 * @returns A promise that resolves to the user object if found, otherwise null.
 */
export async function isUserExist(email: string): Promise<User | null> {
  const user = await prismaClient.user.findUnique({ where: { email } });

  return user;
}

/**
 * Creates a new user with the provided registration credentials.
 *
 * @param registerCredentiels - An object containing the user's registration credentials.
 * @param registerCredentiels.username - The username of the new user.
 * @param registerCredentiels.email - The email address of the new user.
 * @param registerCredentiels.password - The password of the new user.
 * @returns A promise that resolves to the newly created user.
 */
export async function createNewUser(
  registerCredentiels: RegisterCredentiels
): Promise<User> {
  const { username, email, password } = registerCredentiels;

  const hashedpassword = await bcrypt.hash(password, 10);

  const newUser = await prismaClient.user.create({
    data: {
      username: username,
      email: email,
      password: hashedpassword,
    },
  });

  return newUser;
}

/**
 * Compares a plain text password with a hashed password to check if they match.
 *
 * @param password - The plain text password to be checked.
 * @param hashedPassword - The hashed password to compare against.
 * @returns A promise that resolves to a boolean indicating whether the passwords match.
 */
export async function checkPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * Creates and saves new access and refresh tokens for a user.
 *
 * @param userId - The ID of the user for whom the tokens are being created.
 * @param res - The HTTP response object used to set the refresh token cookie.
 * @returns A promise that resolves to the new access token.
 *
 * @remarks
 * This function generates a new access token and a new refresh token for the specified user.
 * The refresh token is saved in the database and also set in a cookie in the response.
 */
export async function createAndSaveNewTokens(
  userId: string,
  res: Response
): Promise<string> {
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
  res.cookie(REFRESH_TOKEN_NAME, newRefreshToken, refreshTokenCookieConfig);

  return accessToken;
}
