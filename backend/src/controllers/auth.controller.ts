import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import type { Profile } from 'passport-google-oauth20';

import {
  checkPassword,
  createAndSaveNewTokens,
  createNewUser,
  getUser,
} from '../helpers/auth.helper';
import prismaClient from '../lib/prisma';
import { clearRefreshTokenCookieConfig } from '../config/cookie.config';
import envConfig from '../config/envConfig';

import type { TypedRequest } from '../types';
import type { LoginCredentials, RegisterCredentiels } from '../types/auth.type';
import { sendEmail } from '../utils/sendEmail';
import sendVerificationEmailTemplate from '../templates/email/sendVerificationEmailTemplate';
import { createEmailVericationToken } from '../services/verifyEmail.services';

const REFRESH_TOKEN_NAME = envConfig.jwt.refresh_token.cookie_name;

/**
 * Handles user registration.
 *
 * This function processes the registration request by validating the input fields,
 * checking if the user already exists, and creating a new user if the email is not in use.
 * It sends appropriate HTTP responses based on the outcome of these operations.
 *
 * @param req - The HTTP request object, containing the user registration details in the body.
 * @param res - The HTTP response object, used to send back the appropriate response.
 *
 * @returns A promise that resolves to void.
 *
 * @throws Will send a 400 status code if any of the required fields (username, email, password) are missing.
 * @throws Will send a 409 status code if the email address is already in use.
 * @throws Will send a 500 status code if there is an internal server error.
 */
export async function handleRegister(
  req: TypedRequest<RegisterCredentiels>,
  res: Response
) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: 'Please fill in all fields' });
    return;
  }

  const user = await getUser({ email });

  if (user) {
    res.status(httpStatus.CONFLICT).json({
      message: 'Email address already in use. Please select another one.',
    });
    return;
  }

  const newUser = await createNewUser({
    username,
    email,
    password,
    emailVerified: false,
  });

  // Creates a new email verification token for the user.
  const token = await createEmailVericationToken(newUser.id);

  await sendEmail({
    emailRecipient: newUser.email,
    emailSubject: 'Email Verification',
    emailBody: sendVerificationEmailTemplate(token),
  });

  res.status(httpStatus.CREATED).json({
    message: 'A verification email has been sent to your email.',
    email: newUser.email,
  });
}

/**
 * Handles the login process for a user.
 *
 * @param req - The request object containing the user's email and password.
 * @param res - The response object used to send back the appropriate HTTP response.
 *
 * @remarks
 * This function performs the following steps:
 * 1. Extracts the email and password from the request body.
 * 2. Checks if a user with the provided email exists.
 * 3. If the user does not exist, responds with a 404 status and an appropriate message.
 * 4. If the user exists, checks if the provided password is correct.
 * 5. If the password is incorrect, responds with a 401 status and an appropriate message.
 * 6. If the password is correct, creates and saves new tokens for the user.
 * 7. Responds with a 200 status, a success message, the access token, and user details.
 *
 * @throws Will respond with a 500 status and an "Internal Server Error" message if an error occurs during the process.
 */
export async function handleLogin(
  req: TypedRequest<LoginCredentials>,
  res: Response
) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(httpStatus.BAD_REQUEST).json({
      message: 'Please provide an email and password.',
    });
    return;
  }

  const user = await getUser({ email }, false);

  if (!user) {
    res.status(httpStatus.NOT_FOUND).json({
      message:
        'No User found with this email address. Please provide a valid email address.',
    });
    return;
  }

  const isPasswordCorrect = await checkPassword(password, user.password);

  if (!isPasswordCorrect) {
    res.status(httpStatus.UNAUTHORIZED).json({
      message: 'Invalid password. Please try again.',
    });
    return;
  }

  const accessToken = await createAndSaveNewTokens(user.id, res);

  res.status(httpStatus.OK).json({
    message: 'Login successful',
    accessToken,
    user: { username: user.username, email: user.email },
  });
}

type GoogleUser = {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
};
/**
 * Handles Google login by processing the user profile received from Google,
 * verifying the email, and creating or updating the user in the database.
 * If the login is successful, it generates and saves new tokens and redirects
 * the user to the client callback URL with the access token.
 *
 * @param req - The request object containing the user profile from Google.
 * @param res - The response object used to send the response.
 *
 * @returns {Promise<void>} - A promise that resolves when the login process is complete.
 */
export async function handleGoogleLogin(req: TypedRequest, res: Response) {
  const user = req.user as Profile;

  if (!user) {
    res.status(httpStatus.UNAUTHORIZED).json({
      message: 'Google login failed. Please try again.',
    });
    return;
  }

  const {
    sub: googleId,
    email,
    email_verified,
    name,
    picture,
  } = user._json as GoogleUser;

  if (!email_verified) {
    res.status(httpStatus.UNAUTHORIZED).json({
      message: 'Email not verified. Please try again.',
    });
    return;
  }

  let foundUser = await getUser({ email });

  if (!foundUser) {
    foundUser = await createNewUser({
      username: name,
      emailVerified: email_verified,
      password: googleId,
      profilePicture: picture,
      email,
      googleId,
    });
  } else if (!foundUser.googleId) {
    foundUser = await prismaClient.user.update({
      where: { id: foundUser.id },
      data: { googleId },
    });
  }

  const accessToken = await createAndSaveNewTokens(foundUser.id, res);

  res.redirect(
    `${envConfig.client.url}/auth/callback?access_token=${encodeURIComponent(JSON.stringify(accessToken))}`
  );
}

/**
 * Handles the logout process by clearing the refresh token cookie
 * and removing the token from the database.
 *
 * @param req - The request object containing the cookies.
 * @param res - The response object used to send the status and clear the cookie.
 *
 * The function performs the following steps:
 * 1. Retrieves the refresh token from the cookies.
 * 2. If the refresh token is not present in the cookies, sends a NO_CONTENT status.
 * 3. Checks if the refresh token exists in the database.
 * 4. If the refresh token does not exist in the database, clears the cookie
 * and sends a NO_CONTENT status.
 * 5. Deletes the refresh token from the database.
 * 6. Clears the refresh token cookie.
 * 7. Sends a NO_CONTENT status.
 *
 * If an error occurs during the process, sends an INTERNAL_SERVER_ERROR
 * status with an error message.
 */
export async function handleLogout(req: Request, res: Response) {
  const cookies = req.cookies;

  const refreshTokenFromCookies = cookies[REFRESH_TOKEN_NAME];

  if (!refreshTokenFromCookies) {
    res.sendStatus(httpStatus.NO_CONTENT);
    return;
  }

  // Is refreshToken in db?
  const refreshTokenFromDB = await prismaClient.refreshToken.findUnique({
    where: { token: refreshTokenFromCookies },
  });

  if (!refreshTokenFromDB) {
    res.clearCookie(REFRESH_TOKEN_NAME, clearRefreshTokenCookieConfig);
    res.sendStatus(httpStatus.NO_CONTENT);
    return;
  }

  // Delete refreshToken in db
  await prismaClient.refreshToken.delete({
    where: { token: refreshTokenFromCookies },
  });

  res.clearCookie(REFRESH_TOKEN_NAME, clearRefreshTokenCookieConfig);

  res.sendStatus(httpStatus.NO_CONTENT);
}
