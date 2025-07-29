import { idParamSchema, searchAndPaginationQuerySchema } from "@tubenote/schemas";
import { Router } from "express";

import { validateSessionMiddleware } from "@/middlewares/auth";
import { validateRequest } from "@/middlewares/validation";

import { VideoController } from "./video.controller";

/**
 * Video routes module that defines HTTP endpoints for video-related operations.
 *
 * This module provides the following routes:
 * - GET /count - Retrieves the count of videos for the authenticated user
 * - GET /:id - Retrieves a specific video by its YouTube ID
 * - GET / - Retrieves a paginated list of videos for the authenticated user with optional search
 *
 * All routes require session validation through the validateSessionMiddleware.
 *
 * @module VideoRoutes
 * @requires express.Router
 * @requires @tubenote/schemas - For request validation schemas
 * @requires VideoController - For handling video-related business logic
 * @requires validateSessionMiddleware - For user authentication
 * @requires validateRequest - For request parameter validation
 */
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
