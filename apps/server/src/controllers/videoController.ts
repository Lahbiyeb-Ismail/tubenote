import type { Response } from "express";
import httpStatus from "http-status";
import videoService from "../services/videoService";
import type { EmptyRecord, PaginationQuery, TypedRequest } from "../types";

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
}

export default new VideoController();
