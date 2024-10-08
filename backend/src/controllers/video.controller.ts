import type { Request, Response } from 'express';
import httpStatus from 'http-status';

import { getYoutubeVideoData } from '../helpers/video.helper';
import prismaClient from '../lib/prisma';

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
export async function getVideoData(req: Request, res: Response) {
  const { videoId } = req.body;

  if (!videoId) {
    res.status(httpStatus.BAD_REQUEST).json({ message: 'VideoId is required' });
    return;
  }

  try {
    const videoData = await getYoutubeVideoData(videoId);

    if (!videoData.length) {
      res.status(httpStatus.NOT_FOUND).json({
        message:
          'No Video found with the provided id. Please provide a valid video id.',
      });
      return;
    }

    const video = await prismaClient.video.create({
      data: {
        etag: videoData[0].etag,
        kind: videoData[0].kind,
        youtubeId: videoData[0].id,
        statistics: videoData[0].statistics,
        snippet: videoData[0].snippet,
        player: videoData[0].player,
      },
    });

    res.status(httpStatus.OK).json(video);
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error creating video', error });
  }
}
