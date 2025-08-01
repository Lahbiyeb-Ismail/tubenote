import type { IParamIdDto, ISearchAndPaginationQueryDto } from "@tubenote/dtos";
import type { Request, Response } from "express";

import type { EmptyRecord, TypedRequest } from "@/types";

import { VideoService } from "./video.service";

const videoService = new VideoService();

export class VideoController {
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

  async getUserVideosCount(
    req: Request,
    res: Response,
  ) {
    const sessionData = req.sessionData;

    const data = await videoService.getVideosCount(sessionData);

    res.status(data.statusCode).json(data);
  }

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
