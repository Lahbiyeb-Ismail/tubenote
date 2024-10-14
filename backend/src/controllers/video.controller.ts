import type { Response } from 'express';
import httpStatus from 'http-status';

import { saveVideoData } from '../helpers/video.helper';
import prismaClient from '../lib/prisma';
import type { PayloadRequest } from '../types';

/**
 * Retrieves video data from YouTube and stores it in the database.
 *
 * @param req - The request object containing the videoId in the body.
 * @param res - The response object used to send back the appropriate HTTP response.
 *
 * @remarks
 * - If the videoId is not provided in the request body, a 400 Bad Request status is returned.
 * - If no video data is found for the provided videoId, a 404 Not Found status is returned.
 * - If an error occurs while creating the video in the database, a 500 Internal Server Error
 * status is returned.
 *
 * @returns A JSON response containing the created video data or an error message.
 */

export async function getVideoData(req: PayloadRequest, res: Response) {
  const { videoId } = req.body;

  if (!videoId) {
    res.status(httpStatus.BAD_REQUEST).json({ message: 'VideoId is required' });
    return;
  }

  const userID = req.payload?.userID;

  if (!userID) {
    res.status(httpStatus.BAD_REQUEST).json({ message: 'UserID is required' });
    return;
  }

  const user = await prismaClient.user.findUnique({
    where: { id: userID },
  });

  if (!user) {
    res.status(httpStatus.NOT_FOUND).json({ message: 'User not found' });
    return;
  }

  try {
    const videoExists = await prismaClient.video.findFirst({
      where: { youtubeId: videoId },
    });

    if (videoExists) {
      res.status(httpStatus.OK).json(videoExists);
      return;
    }

    const video = await saveVideoData(videoId, userID, res);

    res.status(httpStatus.OK).json(video);
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error creating video', error });
  }
}

/**
 * Retrieves videos associated with the authenticated user.
 *
 * @param req - The request object containing the payload with user information.
 * @param res - The response object used to send back the appropriate HTTP response.
 *
 * @remarks
 * This function checks if the user is authenticated by verifying the presence of `userID` in the request payload.
 * If the user is not authenticated, it responds with a 401 Unauthorized status.
 * If the user is authenticated, it attempts to fetch the user from the database.
 * If the user is not found, it responds with a 404 Not Found status.
 * If the user is found, it fetches all videos associated with the user and responds with a 200 OK status along with the videos.
 * In case of any errors during the process, it responds with a 500 Internal Server Error status.
 *
 * @throws {Error} If there is an issue with the database query or any other unexpected error.
 */
export async function getUserVideos(req: PayloadRequest, res: Response) {
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

    const videos = await prismaClient.video.findMany({
      where: { userId: user.id },
    });

    res.status(httpStatus.OK).json({ videos });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error creating note.', error });
  }
}
