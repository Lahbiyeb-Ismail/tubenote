import type { IParamIdDto, ISearchAndPaginationQueryDto } from "@tubenote/dtos";
import type { Request, Response } from "express";

import type { EmptyRecord, TypedRequest } from "@/types";

import { VideoService } from "./video.service";

const videoService = new VideoService();

/**
 * Controller for handling video-related HTTP requests.
 * Manages user video operations including retrieval, counting, and YouTube video lookup.
 */
export class VideoController {
  /**
   * Retrieves a paginated list of videos for the authenticated user.
   *
   * @param req - Typed request object containing search and pagination query parameters
   * @param res - Express response object
   * @returns Promise that resolves when the response is sent with user videos data
   */
  async getUserVideos(
    req: TypedRequest<EmptyRecord, EmptyRecord, ISearchAndPaginationQueryDto>,
    res: Response,
  ) {
    const sessionData = req.sessionData;
    const queryOptions = req.query;

    const data = await videoService.findAll(
      sessionData,
      queryOptions,
    );

    res.status(data.statusCode).json(data);
  }

  /**
   * Gets the total count of videos for the authenticated user.
   *
   * @param req - Express request object containing session data
   * @param res - Express response object
   * @returns Promise that resolves when the response is sent with video count data
   */
  async getUserVideosCount(
    req: Request,
    res: Response,
  ) {
    const sessionData = req.sessionData;

    const data = await videoService.getVideosCount(sessionData);

    res.status(data.statusCode).json(data);
  }

  /**
   * Retrieves a specific video by its YouTube video ID.
   *
   * @param req - Typed request object containing the YouTube video ID in params
   * @param res - Express response object
   * @returns Promise that resolves when the response is sent with the video data
   */
  async getVideoByYoutubeId(
    req: TypedRequest<EmptyRecord, IParamIdDto>,
    res: Response,
  ) {
    const sessionData = req.sessionData;
    const ytVideoId = req.params.id;

    const data = await videoService.findVideoByYtVideoId(sessionData, ytVideoId);

    res.status(data.statusCode).json(data);
  }
}
