import type { Response } from "express";
import httpStatus from "http-status";

import type { EmptyRecord, TypedRequest } from "../../types";

import { IVideoService } from "./video.service";

import type { FindManyDto } from "../../common/dtos/find-many.dto";
import type { IdParamDto } from "../../common/dtos/id-param.dto";
import type { QueryPaginationDto } from "../../common/dtos/query-pagination.dto";

export interface IVideoController {
  getUserVideos(
    req: TypedRequest<EmptyRecord, EmptyRecord, QueryPaginationDto>,
    res: Response
  ): Promise<void>;
  getVideoByIdOrCreate(
    req: TypedRequest<EmptyRecord, IdParamDto>,
    res: Response
  ): Promise<void>;
}

/**
 * Controller for handling video-related operations.
 */
export class VideoController implements IVideoController {
  private videoService: IVideoService;

  constructor(videoService: IVideoService) {
    this.videoService = videoService;
  }

  /**
   * Retrieves a paginated list of videos for a specific user.
   *
   * @param req - The request object containing user ID and pagination query parameters.
   * @param res - The response object to send the result.
   *
   * @returns A JSON response with the list of videos and pagination details.
   */
  async getUserVideos(
    req: TypedRequest<EmptyRecord, EmptyRecord, QueryPaginationDto>,
    res: Response
  ) {
    const userId = req.userId;

    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    const skip = (page - 1) * limit;

    const findManyDto: FindManyDto = {
      userId,
      limit,
      skip,
      sort: { by: "createdAt", order: "desc" },
    };

    const { totalPages, videos, videosCount } =
      await this.videoService.getUserVideos(findManyDto);

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
  async getVideoByIdOrCreate(
    req: TypedRequest<EmptyRecord, IdParamDto>,
    res: Response
  ) {
    const { id } = req.params;
    const userId = req.userId;

    const video = await this.videoService.findVideoOrCreate({
      userId,
      youtubeVideoId: id,
    });

    res.status(httpStatus.OK).json(video);
  }
}
