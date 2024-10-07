import type { Request, Response } from 'express';
import httpStatus from 'http-status';

import { createNewUser, isUserExist } from '../helpers/auth.helper';

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
