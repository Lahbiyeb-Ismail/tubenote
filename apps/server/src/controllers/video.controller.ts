import type { Response } from "express";
import httpStatus from "http-status";

import type { EmptyRecord, PaginationQuery, TypedRequest } from "../types";
import type { VideoIdParam } from "../types/video.type";

import {
  createVideoEntry,
  fetchUserVideos,
  findVideo,
  getUserVideosCount,
} from "../services/video.services";

import {
  fetchNotesByVideoId,
  getVideoNotesCount,
} from "../services/note.services";
import logger from "../utils/logger";

/**
 * Retrieves the videos associated with a specific user.
 *
 * @param req - The request object, which contains the userId.
 * @param res - The response object used to send back the videos.
 * @returns A JSON response containing the user's videos.
 */
export async function getUserVideos(
  req: TypedRequest<EmptyRecord, EmptyRecord, PaginationQuery>,
  res: Response
) {
  const userId = req.userId;

  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  const skip = (page - 1) * limit;

  const [videosCount, videos] = await Promise.all([
    getUserVideosCount({ userId }),
    fetchUserVideos({ userId, skip, limit }),
  ]);

  const totalPages = Math.ceil(videosCount / limit);

  res.status(httpStatus.OK).json({
    videos,
    pagination: {
      totalPages,
      currentPage: page,
      totalVideos: videosCount,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
}

/**
 * Handles the request to get a video by its ID.
 *
 * This function retrieves a video based on the provided video ID and user ID.
 * If the video is found, it returns the video data. If the video is not found,
 * it creates a new video entry and returns the newly created video data.
 *
 * @param req - The request object containing the video ID in the parameters and user ID.
 * @param res - The response object used to send the response back to the client.
 *
 * @returns A JSON response with the video data or an error message if the video ID is not provided.
 */
export async function handleGetVideoById(
  req: TypedRequest<EmptyRecord, VideoIdParam>,
  res: Response
) {
  const { videoId } = req.params;
  const userId = req.userId;

  const video = await createVideoEntry({ videoId, userId });

  res.status(httpStatus.OK).json(video);
}

/**
 * Handles the request to get notes by video ID.
 *
 * @param req - The request object containing user ID and video ID.
 * @param res - The response object to send the result.
 *
 * @remarks
 * This function retrieves notes associated with a specific video ID for a user.
 * It supports pagination through query parameters `page` and `limit`.
 *
 * @returns A JSON response containing the video details, notes, and pagination information.
 *
 * @throws If the video ID is not provided, it returns a 400 Bad Request status with an error message.
 */
export async function handleGetNotesByVideoId(
  req: TypedRequest<EmptyRecord, VideoIdParam, PaginationQuery>,
  res: Response
) {
  const userId = req.userId;
  const { videoId } = req.params;

  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  const skip = (page - 1) * limit;

  const [video, notesCount, notes] = await Promise.all([
    findVideo({ youtubeId: videoId }),
    getVideoNotesCount({ userId, videoId }),
    fetchNotesByVideoId({ userId, videoId, limit, skip }),
  ]);

  const totalPages = Math.ceil(notesCount / limit);

  res.status(httpStatus.OK).json({
    video,
    notes,
    pagination: {
      totalPages,
      currentPage: page,
      totalNotes: notesCount,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
}
