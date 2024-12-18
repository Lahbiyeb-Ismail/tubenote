import type { Response } from "express";
import httpStatus from "http-status";

import type { EmptyRecord, PaginationQuery, TypedRequest } from "../types";

import videoService from "../services/videoService";
import type { VideoIdParam } from "../types/video.type";

class VideoController {
  async getUserVideos(
    req: TypedRequest<EmptyRecord, EmptyRecord, PaginationQuery>,
    res: Response
  ) {
    const userId = req.userId;

    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    const skip = (page - 1) * limit;

    const { totalPages, videos, videosCount } =
      await videoService.fetchUserVideos({ userId, skip, limit });

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

  async getVideoById(
    req: TypedRequest<EmptyRecord, VideoIdParam>,
    res: Response
  ) {
    const { videoId } = req.params;
    const userId = req.userId;

    const video = await videoService.find({ videoId, userId });

    res.status(httpStatus.OK).json(video);
  }
}

export default new VideoController();
