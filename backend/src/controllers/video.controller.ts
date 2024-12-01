import type { Response, Request } from 'express';
import httpStatus from 'http-status';

import {
  createVideoEntry,
  findUserVideos,
  findVideo,
} from '../services/video.services';

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

export async function handleCreateVideo(
  req: Request,
  res: Response
): Promise<void> {
  const userId = req.userId;
  const { videoId } = req.body;

  if (!videoId) {
    res.status(httpStatus.BAD_REQUEST).json({ message: 'VideoId is required' });
    return;
  }

  const videoExists = await findVideo(videoId);

  if (videoExists) {
    res.status(httpStatus.OK).json(videoExists);
    return;
  }

  const video = await createVideoEntry(videoId, userId);

  res.status(httpStatus.OK).json(video);
}

/**
 * Retrieves the videos associated with a specific user.
 *
 * @param req - The request object, which contains the userId.
 * @param res - The response object used to send back the videos.
 * @returns A JSON response containing the user's videos.
 */
export async function getUserVideos(req: Request, res: Response) {
  const userId = req.userId;

  const videos = await findUserVideos(userId);

  res.status(httpStatus.OK).json({ videos });
}
