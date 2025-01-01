import { Router } from "express";

import isAuthenticated from "../../middlewares/isAuthenticated";
import validateRequest from "../../middlewares/validateRequest";

import { paginationQuerySchema } from "../../schemas";
import VideoController from "./videoController";
import { videoIdParamSchema } from "./videoValidationSchemas";

const router = Router();

// - isAuthenticated: Ensures the user is authenticated before accessing any video routes.
router.use(isAuthenticated);

// - GET /: Get all videos for the authenticated user
// - POST /: Create a new video (requires request body validation)
router
  .route("/")
  .get(
    validateRequest({ query: paginationQuerySchema }),
    VideoController.getUserVideos
  );

router
  .route("/:youtubeId")
  .get(
    validateRequest({ params: videoIdParamSchema }),
    VideoController.getVideoById
  );

export default router;
