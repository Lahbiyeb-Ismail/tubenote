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
