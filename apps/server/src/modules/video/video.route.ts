import { Router } from "express";

import prismaClient from "../../lib/prisma";

import { VideoController } from "./video.controller";
import { VideoDatabase } from "./video.db";
import { VideoService } from "./video.service";

import isAuthenticated from "../../middlewares/isAuthenticated";
import validateRequest from "../../middlewares/validateRequest";

import { idParamSchema } from "../../common/schemas/id-param.schema";
import { paginationSchema } from "../../common/schemas/query-pagination.schema";

const videoDB = new VideoDatabase(prismaClient);
const videoService = new VideoService(videoDB);
const videoController = new VideoController(videoService);

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
    videoController.getVideoById(req, res)
  );

export default router;
