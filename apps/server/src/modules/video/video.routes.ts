import { Router } from "express";

import { isAuthenticated, validateRequest } from "@/middlewares";

import { idParamSchema, paginationQuerySchema } from "@/modules/shared/schemas";

import { videoController } from "./video.module";

const router = Router();

// - isAuthenticated: Ensures the user is authenticated before accessing any video routes.
router.use(isAuthenticated);

// - GET /: Get all videos for the authenticated user
// - POST /: Create a new video (requires request body validation)
router
  .route("/")
  .get(validateRequest({ query: paginationQuerySchema }), (req, res) =>
    videoController.getUserVideos(req, res)
  );

router
  .route("/:id")
  .get(validateRequest({ params: idParamSchema }), (req, res) =>
    videoController.getVideoByIdOrCreate(req, res)
  );

export default router;
