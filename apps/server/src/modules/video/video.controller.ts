import type { Video } from "@tubenote/db";
import type { IParamIdDto, ISearchAndPaginationQueryDto } from "@tubenote/dtos";
import type { Response } from "express";

import { youtubeTranscriptService } from "@tubenote/youtube-api";
import { inject, injectable } from "inversify";

import type { IResponseFormatter } from "@/modules/shared/services";
import type { EmptyRecord, TypedRequest } from "@/modules/shared/types";

import { TYPES } from "@/config/inversify/types";

import type { IVideoController, IVideoService } from "./video.types";

/**
 * Controller for handling video-related operations.
 */
@injectable()
export class VideoController implements IVideoController {
  constructor(
    @inject(TYPES.VideoService) private _videoService: IVideoService,
    @inject(TYPES.ResponseFormatter)
    private _responseFormatter: IResponseFormatter,
  ) {}

  async getYoutubeVideoTranscript(req: TypedRequest<EmptyRecord, IParamIdDto>, res: Response) {
    const ytVideoId = req.params.id;
    const { language, format, timestamps, startTime, endTime } = req.query;

    const request = {
      ytVideoId,
      language: language as string,
      format: (format as "text" | "json") || "text",
      timestamps: timestamps === "true",
      startTime: startTime as string,
      endTime: endTime as string,
    };

    const transcript = await youtubeTranscriptService.getTranscript(
      request,
    );

    res.json(transcript);
  }

  /**
   * Retrieves a paginated list of videos for the authenticated user.
   *
   * @param req - The typed request object containing user authentication information and pagination query parameters
   * @param res - The Express response object used to send the paginated response
   * @returns A Promise that resolves when the response is sent with the paginated video data
   *
   * @throws Will return an error response if the user is not authenticated or if there's an issue retrieving the videos
   *
   */
  async getUserVideos(
    req: TypedRequest<EmptyRecord, EmptyRecord, ISearchAndPaginationQueryDto>,
    res: Response,
  ) {
    const userId = req.userId;

    const paginatedData = await this._videoService.getUserVideos(
      userId,
      req.query,
    );

    const formattedResponse = this._responseFormatter.formatPaginatedResponse({
      page: +req.query.page,
      paginatedData,
      responseOptions: {
        message: "Videos retrieved successfully.",
      },
    });

    res.status(formattedResponse.statusCode).json(formattedResponse);
  }

  /**
   * Retrieves the total count of videos for the authenticated user.
   *
   * @param req - The typed request object containing user authentication information
   * @param res - The Express response object used to send the response
   * @returns A Promise that resolves when the response is sent with the video count
   *
   * @throws Will return an error response if the user is not authenticated or if there's an issue retrieving the count
   *
   */
  async getUserVideosCount(
    req: TypedRequest<EmptyRecord>,
    res: Response,
  ) {
    const userId = req.userId;

    const count = await this._videoService.getUserVideosCount(userId);

    const formattedResponse = this._responseFormatter.formatSuccessResponse({
      responseOptions: {
        data: count,
        message: "Videos count retrieved successfully.",
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
    res: Response,
  ) {
    const videoYoutubeId = req.params.id;
    const userId = req.userId;

    const video = await this._videoService.getVideoByYoutubeId(userId, videoYoutubeId);

    const formattedResponse
      = this._responseFormatter.formatSuccessResponse<Video>({
        responseOptions: {
          data: video,
          message: "Video retrieved successfully.",
        },
      });

    res.status(formattedResponse.statusCode).json(formattedResponse);
  }
}
