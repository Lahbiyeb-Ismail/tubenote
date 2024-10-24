import type { Request, Response } from 'express';
import httpStatus from 'http-status';

import {
  checkPassword,
  createAndSaveNewTokens,
  createNewUser,
  isUserExist,
} from '../helpers/auth.helper';
import prismaClient from '../lib/prisma';
import { clearRefreshTokenCookieConfig } from '../config/cookie.config';
import envConfig from '../config/envConfig';

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
export async function handleRegister(req: Request, res: Response) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ message: 'Please fill in all fields' });
    return;
  }

  const user = await isUserExist(email);

  if (user) {
    res.status(httpStatus.CONFLICT).json({
      message: 'Email address already in use. Please select another one.',
    });
    return;
  }

  const newUser = await createNewUser({ username, email, password });

  res.status(httpStatus.CREATED).json({
    message: 'User created successfully',
    username: newUser.username,
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
export async function handleLogin(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await isUserExist(email);

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
