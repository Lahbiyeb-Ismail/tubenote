import type { Response } from "express";
import httpStatus from "http-status";

import type { IPaginationQueryDto, IParamIdDto } from "@tubenote/dtos";
import type { Video } from "@tubenote/types";

import type { EmptyRecord, TypedRequest } from "@/modules/shared/types";

import type { IResponseFormatter } from "@/modules/shared/services";

import type {
  IVideoController,
  IVideoControllerOptions,
  IVideoService,
} from "./video.types";

/**
 * Controller for handling video-related operations.
 */
export class VideoController implements IVideoController {
  private static _instance: VideoController;

  private constructor(
    private readonly _responseFormatter: IResponseFormatter,
    private readonly _videoService: IVideoService
  ) {}

  public static getInstance(options: IVideoControllerOptions): VideoController {
    if (!this._instance) {
      this._instance = new VideoController(
        options.responseFormatter,
        options.videoService
      );
    }

    return this._instance;
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
    req: TypedRequest<EmptyRecord, EmptyRecord, IPaginationQueryDto>,
    res: Response
  ) {
    const userId = req.userId;

    const findManyDto = this._responseFormatter.getPaginationQueries({
      reqQuery: req.query,
      itemsPerPage: 8,
    });

    const paginatedData = await this._videoService.getUserVideos(
      userId,
      findManyDto
    );

    const formattedResponse = this._responseFormatter.formatPaginatedResponse({
      page: req.query.page || 1,
      paginatedData,
      responseOptions: {
        status: httpStatus.OK,
        message: "Videos retrieved successfully.",
      },
    });

    res.status(httpStatus.OK).json(formattedResponse);
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
    req: TypedRequest<EmptyRecord, IParamIdDto>,
    res: Response
  ) {
    const videoYoutubeId = req.params.id;
    const userId = req.userId;

    const video = await this._videoService.findVideoOrCreate(
      userId,
      videoYoutubeId
    );

    const formattedResponse = this._responseFormatter.formatResponse<Video>({
      responseOptions: {
        data: video,
        status: httpStatus.OK,
        message: "Video retrieved successfully.",
      },
    });

    res.status(httpStatus.OK).json(formattedResponse);
  }
}
