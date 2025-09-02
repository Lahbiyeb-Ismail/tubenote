import type { IVideoTranscriptQueryDto } from "@tubenote/dtos";
import type { Response } from "express";

import { Router } from "express";

import { isAuthenticated } from "@/middlewares";

import type { EmptyRecord, TypedRequest } from "../shared/types";

import { videoController } from "./video.module";

const videoRoutes: Router = Router();

// - isAuthenticated: Ensures the user is authenticated before accessing any video routes.
videoRoutes.use(isAuthenticated);

// - GET /: Get all videos for the authenticated user
// - GET /count: Get the total count of videos for the authenticated user
// - POST /: Create a new video (requires request body validation)

videoRoutes
  .route("/count")
  .get((req, res) =>
    videoController.getUserVideosCount(req, res));

videoRoutes.route("/transcript")
  .get((req: TypedRequest<EmptyRecord, EmptyRecord, IVideoTranscriptQueryDto>, res: Response) =>
    videoController.getVideoTranscript(req, res));

videoRoutes
  .route("/:id")
  .get((req, res) =>
    videoController.getVideoByYoutubeId(req, res));

videoRoutes
  .route("/")
  .get((req, res) =>
    videoController.getUserVideos(req as any, res));

export { videoRoutes };
