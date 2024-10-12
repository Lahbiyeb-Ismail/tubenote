import type { Response } from 'express';

import type { PayloadRequest } from '../types';
import prismaClient from '../lib/prisma';
import httpStatus from 'http-status';

/**
 * Creates a new note for the authenticated user.
 *
 * @param req - The request object containing the payload and body data.
 * @param res - The response object used to send back the appropriate HTTP response.
 *
 * The function performs the following steps:
 * 1. Extracts the userID from the request payload.
 * 2. Checks if the userID is present; if not, responds with an UNAUTHORIZED status.
 * 3. Fetches the user from the database using the userID.
 * 4. Checks if the user exists; if not, responds with a NOT_FOUND status.
 * 5. Extracts the title, content, videoTitle, thumbnail, and videoId from the request body.
 * 6. Checks if all required fields are present; if not, responds with a BAD_REQUEST status.
 * 7. Attempts to create a new note in the database with the provided data.
 * 8. If successful, responds with a CREATED status and the created note.
 * 9. If an error occurs during note creation, responds with an INTERNAL_SERVER_ERROR status.
 *
 * @throws {Error} If there is an issue with the database operation.
 */
export async function createNote(req: PayloadRequest, res: Response) {
  const userID = req.payload?.userID;

  if (!userID) {
    res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: 'Unauthorized access. Please try again.' });
    return;
  }

  const user = await prismaClient.user.findUnique({
    where: { id: userID },
  });

  if (!user) {
    res
      .status(httpStatus.NOT_FOUND)
      .json({ message: 'Unauthorized access. Please try again.' });
    return;
  }

  const { title, content, videoTitle, thumbnail, videoId } = req.body;

  if (!title || !content || !videoTitle || !thumbnail || !videoId) {
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: 'Please provide all the required fields.' });
    return;
  }

  try {
    const note = await prismaClient.note.create({
      data: {
        title,
        content,
        videoTitle,
        thumbnail,
        videoId,
        userId: user.id,
      },
    });

    res
      .status(httpStatus.CREATED)
      .json({ message: 'Note created successfully.', note });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error creating note.', error });
  }
}

/**
 * Retrieves the notes for a specific user based on the user ID provided in the request payload.
 *
 * @param req - The request object containing the payload with the user ID.
 * @param res - The response object used to send back the appropriate HTTP response.
 *
 * @remarks
 * - If the user ID is not present in the request payload, the function responds
 * with a 401 Unauthorized status.
 * - If the user is not found in the database, the function responds with a
 * 404 Not Found status.
 * - If the notes are successfully retrieved, the function responds with a
 * 200 OK status and the notes data.
 * - If an error occurs during the process, the function responds with a
 * 500 Internal Server Error status.
 *
 * @returns A promise that resolves to void.
 */
export async function getUserNotes(req: PayloadRequest, res: Response) {
  const userID = req.payload?.userID;

  if (!userID) {
    res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: 'Unauthorized access. Please try again.' });
    return;
  }

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

    const notes = await prismaClient.note.findMany({
      where: { userId: user.id },
    });

    res.status(httpStatus.OK).json({ notes });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error creating note.', error });
  }
}
