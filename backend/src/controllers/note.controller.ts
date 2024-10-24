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

  const {
    title,
    content,
    videoTitle,
    thumbnail,
    videoId,
    youtubeId,
    timestamp,
  } = req.body;

  if (
    !title ||
    !content ||
    !videoTitle ||
    !thumbnail ||
    !videoId ||
    !youtubeId ||
    !timestamp
  ) {
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: 'Please provide all the required fields.' });
    return;
  }

  const note = await prismaClient.note.create({
    data: {
      title,
      content,
      videoTitle,
      thumbnail,
      videoId,
      userId: user.id,
      youtubeId,
      timestamp,
    },
  });

  res
    .status(httpStatus.CREATED)
    .json({ message: 'Note created successfully.', note });
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
}

/**
 * Deletes a note based on the provided note ID.
 *
 * @param req - The request object containing the payload and parameters.
 * @param res - The response object used to send the response.
 *
 * The function performs the following steps:
 * 1. Extracts the userID from the request payload.
 * 2. If the userID is not present, responds with an UNAUTHORIZED status.
 * 3. Extracts the noteId from the request parameters.
 * 4. If the noteId is not present, responds with a BAD_REQUEST status.
 * 5. Attempts to find the user in the database using the userID.
 * 6. If the user is not found, responds with a NOT_FOUND status.
 * 7. Deletes the note from the database using the noteId.
 * 8. If successful, responds with an OK status and a success message.
 * 9. If an error occurs during the process, responds with an
 * INTERNAL_SERVER_ERROR status and an error message.
 */
export async function deleteNote(req: PayloadRequest, res: Response) {
  const userID = req.payload?.userID;

  if (!userID) {
    res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: 'Unauthorized access. Please try again.' });
    return;
  }

  const { noteId } = req.params;

  if (!noteId) {
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: 'Please provide the note ID.' });
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

  await prismaClient.note.delete({
    where: { id: noteId },
  });

  res.status(httpStatus.OK).json({ message: 'Note deleted successfully.' });
}

/**
 * Retrieves a note by its ID for the authenticated user.
 *
 * @param req - The request object containing the payload with userID and
 * params with noteId.
 * @param res - The response object used to send back the appropriate HTTP
 * status and JSON data.
 *
 * @remarks
 * - If the userID is not present in the request payload, responds with
 * `401 Unauthorized`.
 * - If the noteId is not provided in the request parameters, responds with
 * `400 Bad Request`.
 * - If the user is not found in the database, responds with `404 Not Found`.
 * - If the note is not found for the given user, responds with `404 Not Found`.
 * - If an error occurs during the process, responds with `500 Internal Server Error`.
 *
 * @returns A JSON response containing the note data if found, or an error
 * message otherwise.
 */
export async function getNoteById(req: PayloadRequest, res: Response) {
  const userID = req.payload?.userID;

  if (!userID) {
    res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: 'Unauthorized access. Please try again.' });
    return;
  }

  const { noteId } = req.params;

  if (!noteId) {
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: 'Please provide the note ID.' });
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

  const note = await prismaClient.note.findFirst({
    where: { id: noteId, userId: user.id },
  });

  if (!note) {
    res.status(httpStatus.NOT_FOUND).json({ message: 'Note not found.' });
    return;
  }

  res.status(httpStatus.OK).json({ note });
}

/**
 * Updates an existing note for the authenticated user.
 *
 * @param req - The request object containing the payload, parameters, and body.
 * @param res - The response object used to send back the appropriate HTTP response.
 *
 * The function performs the following steps:
 * 1. Extracts the userID from the request payload.
 * 2. Checks if the userID is present; if not, responds with an UNAUTHORIZED status.
 * 3. Extracts the noteId from the request parameters.
 * 4. Checks if the noteId is present; if not, responds with a BAD_REQUEST status.
 * 5. Extracts the title and content from the request body.
 * 6. Attempts to find the user in the database using the userID.
 * 7. If the user is not found, responds with a NOT_FOUND status.
 * 8. Attempts to find the note in the database using the noteId and userId.
 * 9. If the note is not found, responds with a NOT_FOUND status.
 * 10. Updates the note with the new title and content.
 * 11. Responds with an OK status and the updated note if successful.
 * 12. Catches any errors and responds with an INTERNAL_SERVER_ERROR status.
 *
 * @returns {Promise<void>} - A promise that resolves when the function completes.
 */
export async function updateNote(req: PayloadRequest, res: Response) {
  const userID = req.payload?.userID;

  if (!userID) {
    res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: 'Unauthorized access. Please try again.' });
    return;
  }

  const { noteId } = req.params;

  if (!noteId) {
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: 'Please provide the note ID.' });
    return;
  }

  const { title, content, timestamp } = req.body;

  const user = await prismaClient.user.findUnique({
    where: { id: userID },
  });

  if (!user) {
    res
      .status(httpStatus.NOT_FOUND)
      .json({ message: 'Unauthorized access. Please try again.' });
    return;
  }

  const note = await prismaClient.note.findFirst({
    where: { id: noteId, userId: user.id },
  });

  if (!note) {
    res.status(httpStatus.NOT_FOUND).json({ message: 'Note not found.' });
    return;
  }

  const updatedNote = await prismaClient.note.update({
    where: { id: note.id },
    data: {
      title: title || note.title,
      content: content || note.content,
      timestamp: timestamp,
    },
  });

  res
    .status(httpStatus.OK)
    .json({ message: 'Note Updated successfully.', note: updatedNote });
}

/**
 * Retrieves the most recent notes for a user.
 *
 * @param req - The request object containing the user's payload.
 * @param res - The response object to send the result.
 *
 * @remarks
 * This function checks if the user is authenticated by verifying the presence of a userID
 * in the request payload.
 * If the user is not authenticated, it responds with a 401 Unauthorized status.
 * If the user is authenticated, it fetches the user from the database.
 * If the user is not found, it responds with a 404 Not Found status.
 * If the user is found, it retrieves the most recent notes (up to 2) for the user, ordered
 * by creation date in descending order.
 * If an error occurs during the process, it responds with a 500 Internal Server Error status.
 *
 * @returns A JSON response containing the user's most recent notes or an error message.
 */
export async function getUserRecentNotes(req: PayloadRequest, res: Response) {
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

  const notes = await prismaClient.note.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 2,
  });

  res.status(httpStatus.OK).json({ notes });
}

/**
 * Retrieves the most recently updated notes for a user.
 *
 * @param req - The request object containing the payload with user information.
 * @param res - The response object used to send the response back to the client.
 *
 * @remarks
 * This function checks if the user is authenticated by verifying the presence of
 * a userID in the request payload.
 * If the user is not authenticated, it responds with a 401 Unauthorized status.
 * If the user is authenticated, it fetches the user from the database.
 * If the user is not found, it responds with a 404 Not Found status.
 * If the user is found, it retrieves the most recently updated notes for the user,
 * limited to the 2 most recent notes.
 * If an error occurs during the process, it responds with a 500 Internal Server Error status.
 *
 * @returns A JSON response containing the most recently updated notes for the user or an error message.
 */
export async function getUserRecentlyUpdatedNotes(
  req: PayloadRequest,
  res: Response
) {
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

  const notes = await prismaClient.note.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: 'desc' },
    take: 2,
  });

  res.status(httpStatus.OK).json({ notes });
}
