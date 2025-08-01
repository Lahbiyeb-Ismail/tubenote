import { Router } from "express";

import { validateSessionMiddleware } from "@/middlewares/auth";

import { VideoController } from "./video.controller";

const videoController = new VideoController();

const videoRoutes: Router = Router();

videoRoutes.use(validateSessionMiddleware);

videoRoutes
  .route("/count")
  .get(videoController.getUserVideosCount);

videoRoutes
  .route("/:id")
  .get(videoController.getVideoByYoutubeId);

videoRoutes
  .route("/")
  .get(videoController.getUserVideos);

export { videoRoutes };
