import { Router } from "express";

import isAuthenticated from "@middlewares/auth.middleware";
import validateRequest from "@middlewares/validate-request.middleware";

import { videoController } from "@modules/video";

import { idParamSchema } from "@common/schemas/id-param.schema";
import { paginationSchema } from "@common/schemas/query-pagination.schema";

const router = Router();

// - isAuthenticated: Ensures the user is authenticated before accessing any video routes.
router.use(isAuthenticated);

// - GET /: Get all videos for the authenticated user
// - POST /: Create a new video (requires request body validation)
router
  .route("/")
  .get(validateRequest({ query: paginationSchema }), (req, res) =>
    videoController.getUserVideos(req, res)
  );

router
  .route("/:id")
  .get(validateRequest({ params: idParamSchema }), (req, res) =>
    videoController.getVideoByIdOrCreate(req, res)
  );

export default router;
