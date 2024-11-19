import qs from 'qs';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import type { Response, Request } from 'express';
import httpStatus from 'http-status';

import generateAuthToken from './generateAuthToken';
import envConfig from '../config/envConfig';

import type { TypedRequest } from '../types';
import { createRefreshToken } from '../services/refreshToken.services';
import {
  ACCESS_TOKEN_EXPIRE,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRE,
  REFRESH_TOKEN_SECRET,
} from '../constants/auth';

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
 * Creates new access and refresh tokens for a given user.
 *
 * @param userId - The ID of the user for whom the tokens are being created.
 * @returns A promise that resolves to an object containing the new access token and refresh token.
 */
export async function createNewTokens(
  userId: string
): Promise<{ accessToken: string; refreshToken: string }> {
  // Generate new access token
  const accessToken = generateAuthToken({
    userId,
    secret: ACCESS_TOKEN_SECRET,
    expire: ACCESS_TOKEN_EXPIRE,
  });

  // Generate new refresh token
  const refreshToken = generateAuthToken({
    userId,
    secret: REFRESH_TOKEN_SECRET,
    expire: REFRESH_TOKEN_EXPIRE,
  });

  // Save the new refresh token in db
  await createRefreshToken({ userId, token: refreshToken });

  return { accessToken, refreshToken };
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
