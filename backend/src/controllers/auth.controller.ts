import type { Request, Response } from 'express';
import httpStatus from 'http-status';

import {
  checkPassword,
  createAndSaveNewTokens,
  createNewUser,
  isUserExist,
} from '../helpers/auth.helper';

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

  if (!username || !email || !password)
    res.status(400).json({ message: 'Please fill in all fields' });

  try {
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
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
    });
  }
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

  try {
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
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
    });
  }
}
