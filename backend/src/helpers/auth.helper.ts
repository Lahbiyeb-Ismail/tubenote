import qs from 'qs';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import type { Response, Request } from 'express';
import type { User } from '@prisma/client';
import httpStatus from 'http-status';

import prismaClient from '../lib/prisma';
import { createAccessToken, createRefreshToken } from './generateTokens';
import envConfig from '../config/envConfig';
import { refreshTokenCookieConfig } from '../config/cookie.config';

import type { RegisterCredentiels } from '../types/auth.type';
import type { TypedRequest } from 'src/types';

const REFRESH_TOKEN_NAME = envConfig.jwt.refresh_token.cookie_name;

type UserIdentifier = {
  email?: string;
  id?: string;
};

/**
 * Checks if a user exists in the database by email or id.
 *
 * @param {UserIdentifier} param0 - An object containing the user's email and id.
 * @param {string} param0.email - The email of the user.
 * @param {string} param0.id - The id of the user.
 * @param {boolean} [withPassword=true] - A flag indicating whether to include the password in the returned user object.
 * @returns {Promise<User | null>} A promise that resolves to the user object if found, otherwise null.
 */
export async function getUser(
  { email, id }: UserIdentifier,
  withPassword = true
): Promise<User | null> {
  const user = await prismaClient.user.findFirst({
    where: {
      OR: [{ email: email as string }, { id: id as string }],
    },
    omit: { password: withPassword },
  });

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
  const { username, email, password, emailVerified, googleId, profilePicture } =
    registerCredentiels;

  const hashedpassword = await bcrypt.hash(password, 10);

  const newUser = await prismaClient.user.create({
    data: {
      username: username,
      email: email,
      password: hashedpassword,
      emailVerified,
      googleId: googleId || null,
      profilePicture: profilePicture || null,
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

/**
 * Verifies the user ID from the request payload.
 *
 * @param req - The request object containing the payload with the user ID.
 * @param res - The response object used to send an unauthorized status if the user ID is not present.
 * @returns The user ID if it exists in the request payload; otherwise, sends an unauthorized response.
 */
export function verifyUserId(
  req: Request | TypedRequest,
  res: Response
): string | null {
  const userID = req.userId;

  if (!userID) {
    res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: 'Unauthorized access. Please try again.' });
    return null;
  }

  return userID;
}

type GoogleOAuthTokens = {
  access_token: string;
  id_token: string;
  scope: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
};

/**
 * Retrieves Google OAuth tokens using the provided authorization code.
 *
 * @param code - The authorization code received from the Google OAuth flow.
 * @returns A promise that resolves to the Google OAuth tokens.
 * @throws An error if the request to get the tokens fails.
 */
export async function getGoogleOAuthTokens(
  code: string
): Promise<GoogleOAuthTokens> {
  const url = 'https://oauth2.googleapis.com/token';

  const options = {
    code,
    client_id: envConfig.google.client_id,
    client_secret: envConfig.google.client_secret,
    redirect_uri: envConfig.google.redirect_uri,
    grant_type: 'authorization_code',
  };

  try {
    const response = await axios.post<GoogleOAuthTokens>(
      url,
      qs.stringify(options),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get Google OAuth tokens');
  }
}

type GetGoogleUser = {
  id_token: string;
  access_token: string;
};

type GoogleUser = {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
};

/**
 * Fetches the Google user information using the provided ID token and access token.
 *
 * @param {Object} params - The parameters for fetching the Google user.
 * @param {string} params.id_token - The ID token for authorization.
 * @param {string} params.access_token - The access token for fetching user info.
 * @returns {Promise<GoogleUser>} A promise that resolves to the Google user information.
 * @throws {Error} Throws an error if the request to fetch Google user information fails.
 */
export async function getGoogleUser({
  id_token,
  access_token,
}: GetGoogleUser): Promise<GoogleUser> {
  try {
    const res = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to get Google user');
  }
}
