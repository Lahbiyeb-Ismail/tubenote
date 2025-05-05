import type { Response } from "express";
import { inject, injectable } from "inversify";

import type { IPaginationQueryDto, IParamIdDto } from "@tubenote/dtos";
import type { Video } from "@tubenote/types";

import { TYPES } from "@/config/inversify/types";

import type { EmptyRecord, TypedRequest } from "@/modules/shared/types";

import type { IResponseFormatter } from "@/modules/shared/services";

import type { IVideoController, IVideoService } from "./video.types";

/**
 * Controller for handling video-related operations.
 */
@injectable()
export class VideoController implements IVideoController {
  constructor(
    @inject(TYPES.VideoService) private _videoService: IVideoService,
    @inject(TYPES.ResponseFormatter)
    private _responseFormatter: IResponseFormatter
  ) {}

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
        message: "Videos retrieved successfully.",
      },
    });

    res.status(formattedResponse.statusCode).json(formattedResponse);
  }

  /**
   * Retrieves a specific video by its ID for a specific user.
   *
   * @param req - The request object containing user ID and video ID parameters.
   * @param res - The response object to send the result.
   *
   * @returns A JSON response with the video details.
   */
  async saveVideoData(
    req: TypedRequest<EmptyRecord, IParamIdDto>,
    res: Response
  ) {
    const videoYoutubeId = req.params.id;
    const userId = req.userId;

    const video = await this._videoService.saveVideo(userId, videoYoutubeId);

    const formattedResponse =
      this._responseFormatter.formatSuccessResponse<Video>({
        responseOptions: {
          data: video,
          message: "Video retrieved successfully.",
        },
      });

    res.status(formattedResponse.statusCode).json(formattedResponse);
  }

  /**
   * Retrieves a specific video by its ID for a specific user.
   *
   * @param req - The request object containing user ID and video ID parameters.
   * @param res - The response object to send the result.
   *
   * @returns A JSON response with the video details.
   */
  async getVideoByYoutubeId(
    req: TypedRequest<EmptyRecord, IParamIdDto>,
    res: Response
  ) {
    const videoYoutubeId = req.params.id;

    const video = await this._videoService.getVideoByYoutubeId(videoYoutubeId);

    const formattedResponse =
      this._responseFormatter.formatSuccessResponse<Video | null>({
        responseOptions: {
          data: video,
          message: "Video retrieved successfully.",
        },
      });

    res.status(formattedResponse.statusCode).json(formattedResponse);
  }
}
