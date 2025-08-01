import type { Request, Response } from "express";

import { VideoService } from "./video.service";

const videoService = new VideoService();

export class VideoController {
  async getUserVideos(
    req: Request,
    res: Response,
  ) {
    const sessionData = req.sessionData;
    const queryOptions = req.query as any;

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
    req: Request,
    res: Response,
  ) {
    const sessionData = req.sessionData;
    const ytVideoId = req.params.id;

    const data = await videoService.findVideoByYtVideoId(sessionData, ytVideoId);

    res.status(data.statusCode).json(data);
  }
}
