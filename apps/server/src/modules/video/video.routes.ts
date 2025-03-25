import { Router } from "express";

import { isAuthenticated, validateRequest } from "@/middlewares";

import { idParamSchema, paginationQuerySchema } from "@/modules/shared/schemas";

import { videoController } from "./video.module";

const videoRoutes = Router();

// - isAuthenticated: Ensures the user is authenticated before accessing any video routes.
videoRoutes.use(isAuthenticated);

// - GET /: Get all videos for the authenticated user
// - POST /: Create a new video (requires request body validation)
videoRoutes
  .route("/")
  .get(validateRequest({ query: paginationQuerySchema }), (req, res) =>
    videoController.getUserVideos(req, res)
  );

videoRoutes
  .route("/:id")
  .get(validateRequest({ params: idParamSchema }), (req, res) =>
    videoController.getVideoByIdOrCreate(req, res)
  );

export { videoRoutes };
