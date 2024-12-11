import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import generateAuthToken from "./generateAuthToken";

import {
  ACCESS_TOKEN_EXPIRE,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRE,
  REFRESH_TOKEN_SECRET,
} from "../constants/auth";
import { createRefreshToken } from "../services/refreshToken.services";
import type { JwtPayload } from "../types";

/**
 * Hashes a given password using bcrypt.
 *
 * @param password - The plain text password to be hashed.
 * @returns A promise that resolves to the hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);

  return bcrypt.hash(password, salt);
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
 * Verifies a JWT token using the provided secret.
 *
 * @param token - The JWT token to verify.
 * @param secret - The secret key to use for verification.
 * @returns A promise that resolves with the decoded JWT payload if the token is valid, or rejects with an error if the token is invalid.
 */
export async function verifyToken(
  token: string,
  secret: string
): Promise<JwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, payload) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(payload as JwtPayload);
    });
  });
}
