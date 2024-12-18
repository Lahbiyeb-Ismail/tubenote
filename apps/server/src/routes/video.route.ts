import { Router } from "express";

import {
  getUserVideos,
  handleGetNotesByVideoId,
  handleGetVideoById,
} from "../controllers/video.controller";

import isAuthenticated from "../middlewares/isAuthenticated";
import validateRequest from "../middlewares/validateRequest";

import videoController from "../controllers/videoController";
import { paginationQuerySchema } from "../schemas";
import { videoIdParamSchema } from "../schemas/video.schema";

const router = Router();

// - isAuthenticated: Ensures the user is authenticated before accessing any video routes.
router.use(isAuthenticated);

// - GET /: Get all videos for the authenticated user
// - POST /: Create a new video (requires request body validation)
router
  .route("/")
  .get(
    validateRequest({ query: paginationQuerySchema }),
    videoController.getUserVideos
  );

router.route("/:videoId/notes").get(
  validateRequest({
    params: videoIdParamSchema,
    query: paginationQuerySchema,
  }),
  handleGetNotesByVideoId
);

router
  .route("/:videoId")
  .get(
    validateRequest({ params: videoIdParamSchema }),
    videoController.getVideoById
  );

export default router;
