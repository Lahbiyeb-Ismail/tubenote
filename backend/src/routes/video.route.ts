import { Router } from "express";

import {
	getUserVideos,
	handleCreateVideo,
	handleGetNotesByVideoId,
	handleGetVideoById,
} from "../controllers/video.controller";

import isAuthenticated from "../middlewares/isAuthenticated";
import validateRequestBody from "../middlewares/validateRequestBody";
import validateRequestParams from "../middlewares/validateRequestParams";

import {
	createVideoBodySchema,
	videoIdParamSchema,
} from "../schemas/video.schema";

const router = Router();

// - isAuthenticated: Ensures the user is authenticated before accessing any video routes.
router.use(isAuthenticated);

// - GET /: Get all videos for the authenticated user
// - POST /: Create a new video (requires request body validation)
router
	.route("/")
	.get(getUserVideos)
	.post(validateRequestBody(createVideoBodySchema), handleCreateVideo);

router
	.route("/:videoId/notes")
	.get(validateRequestParams(videoIdParamSchema), handleGetNotesByVideoId);

router
	.route("/:videoId")
	.get(validateRequestParams(videoIdParamSchema), handleGetVideoById);

export default router;
