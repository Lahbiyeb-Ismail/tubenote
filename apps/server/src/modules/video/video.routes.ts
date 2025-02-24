import { Router } from "express";

import isAuthenticated from "@middlewares/auth.middleware";
import validateRequest from "@middlewares/validate-request.middleware";

import { videoController } from "@modules/video";

import { paramIdSchema, querypaginationSchema } from "@modules/shared";

const router = Router();

// - isAuthenticated: Ensures the user is authenticated before accessing any video routes.
router.use(isAuthenticated);

// - GET /: Get all videos for the authenticated user
// - POST /: Create a new video (requires request body validation)
router
  .route("/")
  .get(validateRequest({ query: querypaginationSchema }), (req, res) =>
    videoController.getUserVideos(req, res)
  );

router
  .route("/:id")
  .get(validateRequest({ params: paramIdSchema }), (req, res) =>
    videoController.getVideoByIdOrCreate(req, res)
  );

export default router;
