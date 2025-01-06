import { Router } from "express";

import isAuthenticated from "../../middlewares/isAuthenticated";
import validateRequest from "../../middlewares/validateRequest";

import VideoController from "./video.controller";

import { idParamSchema } from "../../common/schemas/id-param.schema";
import { paginationSchema } from "../../common/schemas/query-pagination.schema";

const router = Router();

// - isAuthenticated: Ensures the user is authenticated before accessing any video routes.
router.use(isAuthenticated);

// - GET /: Get all videos for the authenticated user
// - POST /: Create a new video (requires request body validation)
router
  .route("/")
  .get(
    validateRequest({ query: paginationSchema }),
    VideoController.getUserVideos
  );

router
  .route("/:id")
  .get(
    validateRequest({ params: idParamSchema }),
    VideoController.getVideoById
  );

export default router;
