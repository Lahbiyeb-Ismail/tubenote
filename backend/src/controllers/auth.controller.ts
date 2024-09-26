import type { Request, Response } from 'express';
import httpStatus from 'http-status';

import {
  createAndSaveNewTokens,
  createNewUser,
  deleteRefreshTokenFromDB,
  getRefreshTokenFromDB,
  passwordMatches,
  userExists,
} from '../helpers/auth.helper';

import type { TypedRequest } from '../types';
import type { UserLoginCredentials } from '../types/auth';
import config from '../config';
import { clearRefreshTokenCookieConfig } from '../config/cookie.config';

const REFRESH_TOKEN_NAME = config.jwt.refresh_token.cookie_name;

export async function handleSignup(req: Request, res: Response) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'All fields are required. Please provide all fields',
    });
  }

  try {
    const isUserExists = await userExists(email);

    if (isUserExists)
      return res.status(httpStatus.CONFLICT).json({
        message:
          'Email address already exists. Please select another email address.',
      });

    await createNewUser({ username, email, password });

    res.status(httpStatus.CREATED).json({
      message: 'Registration successful! You can now login.',
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
    });
  }
}

/**
 * This function handles the login process for users. It expects a request object with the following properties:
 *
 * @param {TypedRequest<UserLoginCredentials>} req - The request object that includes user's email and password.
 * @param {Response} res - The response object that will be used to send the HTTP response.
 *
 * @returns {Response} Returns an HTTP response that includes one of the following:
 *   - A 400 BAD REQUEST status code and an error message if the request body is missing any required parameters.
 *   - A 401 UNAUTHORIZED status code if the user email does not exist in the database or the email is not verified or the password is incorrect.
 *   - A 200 OK status code and an access token if the login is successful and a new refresh token is stored in the database and a new refresh token cookie is set.
 *   - A 500 INTERNAL SERVER ERROR status code if there is an error in the server.
 */

export const handleLogin = async (
  req: TypedRequest<UserLoginCredentials>,
  res: Response,
): Promise<Response> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: 'Email and password are required!' });
  }

  const user = await userExists(email);

  if (!user)
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: 'Unauthorized access. Please check your credentials.' });

  try {
    // check password
    const isPasswordCorrect = await passwordMatches(password, user.password);

    // if the password is correct, then we create a new access token and a new refresh token
    if (isPasswordCorrect) {
      // Create new access token
      const accessToken = await createAndSaveNewTokens(user.id, res);

      // Send the access token to the client (frontend)
      return res.json({
        accessToken,
        user: { username: user.username, email: user.email },
      });
    }

    // If the password is incorrect then we return an unauthorized status
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: 'Unauthorized access. Please check your credentials.' });
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err });
  }
};

/**
 * This function handles the logout process for users. It expects a request object with the following properties:
 *
 * @param {TypedRequest} req - The request object that includes a cookie with a valid refresh token
 * @param {Response} res - The response object that will be used to send the HTTP response.
 *
 * @returns {Response} Returns an HTTP response that includes one of the following:
 *   - A 204 NO CONTENT status code if the refresh token cookie is undefined
 *   - A 204 NO CONTENT status code if the refresh token does not exists in the database
 *   - A 204 NO CONTENT status code if the refresh token cookie is successfully cleared
 */
export const handleLogout = async (
  req: TypedRequest,
  res: Response,
): Promise<Response> => {
  const cookies = req.cookies;

  console.log('cookies -> ', cookies);

  const refreshTokenFromCookies = cookies[REFRESH_TOKEN_NAME];

  if (!refreshTokenFromCookies) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }

  // Is refreshToken in db?
  const refreshTokenFromDB = await getRefreshTokenFromDB(
    refreshTokenFromCookies,
  );

  if (!refreshTokenFromDB) {
    res.clearCookie(REFRESH_TOKEN_NAME, clearRefreshTokenCookieConfig);
    return res.sendStatus(httpStatus.NO_CONTENT);
  }

  // Delete refreshToken in db
  await deleteRefreshTokenFromDB(refreshTokenFromCookies);

  res.clearCookie(REFRESH_TOKEN_NAME, clearRefreshTokenCookieConfig);

  return res.sendStatus(httpStatus.NO_CONTENT);
};
