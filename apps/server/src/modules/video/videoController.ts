import type { Response } from "express";
import httpStatus from "http-status";

import type { EmptyRecord, PaginationQuery, TypedRequest } from "../../types";
import type { VideoIdParam } from "./video.type";

import VideoService from "./videoService";

/**
 * Controller for handling video-related operations.
 */
class VideoController {
  /**
   * Retrieves a paginated list of videos for a specific user.
   *
   * @param req - The request object containing user ID and pagination query parameters.
   * @param res - The response object to send the result.
   *
   * @returns A JSON response with the list of videos and pagination details.
   */
  async getUserVideos(
    req: TypedRequest<EmptyRecord, EmptyRecord, PaginationQuery>,
    res: Response
  ) {
    const userId = req.userId;

    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    const skip = (page - 1) * limit;

    const { totalPages, videos, videosCount } =
      await VideoService.findUserVideos({ userId, skip, limit });

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
   * Retrieves a specific video by its ID for a specific user.
   *
   * @param req - The request object containing user ID and video ID parameters.
   * @param res - The response object to send the result.
   *
   * @returns A JSON response with the video details.
   */
  async getVideoById(
    req: TypedRequest<EmptyRecord, VideoIdParam>,
    res: Response
  ) {
    const { videoId } = req.params;
    const userId = req.userId;

    const video = await VideoService.findVideoById({ videoId, userId });

    res.status(httpStatus.OK).json(video);
  }
}
export default new VideoController();
