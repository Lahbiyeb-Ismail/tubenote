import type { Response } from 'express';
import httpStatus from 'http-status';

import type { PayloadRequest } from '../types';
import prismaClient from '../lib/prisma';
import { isUserExist } from '../helpers/auth.helper';

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
  const userID = req.payload?.userID;

  if (!userID) {
    res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: 'Unauthorized access. Please try again.' });
    return;
  }

  const { username, email } = req.body;

  try {
    const user = await prismaClient.user.findUnique({
      where: { id: userID },
    });

    if (!user) {
      res
        .status(httpStatus.NOT_FOUND)
        .json({ message: 'Unauthorized access. Please try again.' });
      return;
    }

    const isEmailTaken = await isUserExist(email);

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
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error updating the current user.', error });
  }
}
