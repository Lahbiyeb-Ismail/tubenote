import { Router } from "express";

import { getVideoNotes } from "../controllers/noteControllers";

const router = Router();

/**
 * Route for retrieving notes for a specific video.
 * @route GET /videos/:video_id/notes
 */
router.route("/videos/:video_id/notes").get(getVideoNotes);

// router.route("/videos/:video_id/notes").post(checkVideoExists, createVideoNote);

export default router;
