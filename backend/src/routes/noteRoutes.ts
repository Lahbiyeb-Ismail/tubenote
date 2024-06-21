import { Router } from "express";
import checkVideoExists from "src/middlewares/checkVideoExists";

import { getVideoNotes } from "../controllers/noteControllers";

const router = Router();

/**
 * Retrieves notes for a specific video.
 *
 * @route GET /videos/:video_id/notes
 * @returns {Array<Note>} An array of notes for the specified video.
 */
router.route("/videos/:video_id/notes").get(getVideoNotes);

/**
 * Creates a new note for a specific video.
 *
 * @route POST /videos/:video_id/notes
 * @param {Note} noteData - The data of the note to be created.
 * @returns {Note} The created note.
 */
router.route("/videos/:video_id/notes").post(checkVideoExists, createVideoNote);

export default router;
