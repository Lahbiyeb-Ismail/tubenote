import type { Response } from "express";
import httpStatus from "http-status";

import type { EmptyRecord, TypedRequest } from "@/types";

import type {
  IFindAllDto,
  IParamIdDto,
  IQueryPaginationDto,
  IResponseFormatter,
} from "@modules/shared";
import type { IVideoController, IVideoService } from "@modules/video";

/**
 * Controller for handling video-related operations.
 */
export class VideoController implements IVideoController {
  constructor(
    private readonly _responseFormatter: IResponseFormatter,
    private readonly _videoService: IVideoService
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
    req: TypedRequest<EmptyRecord, EmptyRecord, IQueryPaginationDto>,
    res: Response
  ) {
    const userId = req.userId;

    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const order = String(req.query.order);
    const sortBy = String(req.query.sortBy);

    const skip = (page - 1) * limit;

    const findAllDto: IFindAllDto = {
      userId,
      limit,
      skip,
      sort: { by: sortBy, order },
    };

    const paginatedItems = await this._videoService.getUserVideos(findAllDto);

    const formattedResponse = this._responseFormatter.formatPaginatedResponse(
      req.query,
      paginatedItems
    );

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
    const { id } = req.params;
    const userId = req.userId;

    const video = await this._videoService.findVideoOrCreate({
      userId,
      id,
    });

    const formattedResponse = this._responseFormatter.formatResponse(video);

    res.status(httpStatus.OK).json(formattedResponse);
  }
}
