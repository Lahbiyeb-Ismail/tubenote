import type { Response } from 'express';
import httpStatus from 'http-status';
import bcrypt from 'bcryptjs';

import type { PayloadRequest } from '../types';
import prismaClient from '../lib/prisma';
import { checkPassword, getUser, verifyUserId } from '../helpers/auth.helper';

/**
 * Retrieves the current user based on the user ID present in the request payload.
 *
 * @param req - The request object containing the payload with the user ID.
 * @param res - The response object used to send the response back to the client.
 *
 * @remarks
 * - If the user ID is not present in the request payload, the function responds with a 401 Unauthorized status.
 * - If the user is not found in the database, the function responds with a 404 Not Found status.
 * - If there is an error during the database query, the function responds with a 500 Internal Server Error status.
 *
 * @returns A JSON response containing the user data if found, or an error message if not.
 */
export async function getCurrentUser(req: PayloadRequest, res: Response) {
  const userID = verifyUserId(req, res) as string;

  const user = await getUser({ id: userID });

  if (!user) {
    res
      .status(httpStatus.NOT_FOUND)
      .json({ message: 'User not found. Please try again.' });
    return;
  }

  res.status(httpStatus.OK).json({ user });
}

/**
 * Updates the current user's information based on the provided request payload.
 *
 * @param req - The request object containing the payload with userID and body with username and email.
 * @param res - The response object used to send back the appropriate HTTP status and message.
 *
 * @remarks
 * - If the userID is not present in the request payload, the function responds with an `UNAUTHORIZED` status.
 * - If the user is not found in the database, the function responds with a `NOT_FOUND` status.
 * - If the email is already taken by another user, the function responds with a `BAD_REQUEST` status.
 * - If no changes are detected in the username and email, the function responds with an
 * `OK` status indicating no changes.
 * - If the user is successfully updated, the function responds with an `OK` status and
 * the updated user information.
 * - If an error occurs during the process, the function responds with an `INTERNAL_SERVER_ERROR` status.
 *
 * @throws Will throw an error if the database operation fails.
 */
export async function updateCurrentUser(req: PayloadRequest, res: Response) {
  const { username, email } = req.body;
  const userID = verifyUserId(req, res) as string;

  const user = await getUser({ id: userID });

  if (!user) {
    res
      .status(httpStatus.NOT_FOUND)
      .json({ message: 'Unauthorized access. Please try again.' });
    return;
  }

  const isEmailTaken = await getUser({ email });

  if (isEmailTaken && isEmailTaken.id !== user.id) {
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: 'Email is already taken. Please try another one.' });
    return;
  }

  if (username === user.username && email === user.email) {
    res.status(httpStatus.OK).json({
      message: 'No changes detected. User information remains the same.',
    });
    return;
  }

  const updatedUser = await prismaClient.user.update({
    where: { id: userID },
    data: { username, email },
    omit: { password: true, id: true },
  });

  res
    .status(httpStatus.OK)
    .json({ message: 'User updated successfully.', user: updatedUser });
}

/**
 * Updates the password of the current user.
 *
 * @param req - The request object containing the payload and body.
 * @param res - The response object used to send the response.
 *
 * The function performs the following steps:
 * 1. Extracts the userID from the request payload.
 * 2. Validates the presence of userID, currentPassword, and newPassword.
 * 3. Ensures the new password is different from the current password.
 * 4. Fetches the user from the database using the userID.
 * 5. Validates the current password.
 * 6. Hashes the new password and updates it in the database.
 * 7. Sends appropriate responses based on the success or failure of each step.
 *
 * @throws {Error} If there is an issue updating the password in the database.
 */
export async function updateUserPassword(req: PayloadRequest, res: Response) {
  const userID = verifyUserId(req, res) as string;

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: 'All fields are required.' });
    return;
  }

  const user = await getUser({ id: userID });

  if (!user) {
    res
      .status(httpStatus.NOT_FOUND)
      .json({ message: 'Unauthorized access. Please try again.' });
    return;
  }

  const isPasswordValid = await checkPassword(currentPassword, user.password);

  if (!isPasswordValid) {
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: 'Invalid current password. Please try again.' });
    return;
  }

  if (currentPassword === newPassword) {
    res.status(httpStatus.BAD_REQUEST).json({
      message: 'New password must be different from the current password.',
    });
    return;
  }

  const newHashedPassword = await bcrypt.hash(newPassword, 10);

  const updatedUser = await prismaClient.user.update({
    where: { id: userID },
    data: { password: newHashedPassword },
    omit: { password: true },
  });

  res
    .status(httpStatus.OK)
    .json({ message: 'Password updated successfully.', user: updatedUser });
}
