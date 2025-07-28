import { idParamSchema, searchAndPaginationQuerySchema } from "@tubenote/schemas";
import { Router } from "express";

import { validateSessionMiddleware } from "@/middlewares/auth";
import { validateRequest } from "@/middlewares/validation";

import { VideoController } from "./video.controller";

const videoController = new VideoController();

const videoRoutes: Router = Router();

videoRoutes.use(validateSessionMiddleware);

videoRoutes
  .route("/count")
  .get(videoController.getUserVideosCount);

videoRoutes
  .route("/:id")
  .get(validateRequest({ params: idParamSchema }), videoController.getVideoByYoutubeId);

videoRoutes
  .route("/")
  .get(validateRequest({ query: searchAndPaginationQuerySchema }), videoController.getUserVideos);

export { videoRoutes };
