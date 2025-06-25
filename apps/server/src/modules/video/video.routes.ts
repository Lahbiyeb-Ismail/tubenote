import { idParamSchema, paginationQuerySchema } from "@tubenote/schemas";
import { Router } from "express";

import { isAuthenticated, validateRequest } from "@/middlewares";

import { videoController } from "./video.module";

const videoRoutes: Router = Router();

// - isAuthenticated: Ensures the user is authenticated before accessing any video routes.
videoRoutes.use(isAuthenticated);

// - GET /: Get all videos for the authenticated user
// - GET /count: Get the total count of videos for the authenticated user
// - POST /: Create a new video (requires request body validation)
videoRoutes
  .route("/")
  .get(validateRequest({ query: paginationQuerySchema }), (req, res) =>
    videoController.getUserVideos(req, res));

videoRoutes
  .route("/count")
  .get((req, res) =>
    videoController.getUserVideosCount(req, res));

videoRoutes
  .route("/:id")
  .get(validateRequest({ params: idParamSchema }), (req, res) =>
    videoController.getVideoByYoutubeId(req, res));

export { videoRoutes };
