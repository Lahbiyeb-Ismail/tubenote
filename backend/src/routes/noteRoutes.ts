import { Router } from 'express';

import { createVideoNote, getVideoNotes } from '../controllers/noteControllers';
import checkVideoExists from '../middlewares/checkVideoExists';
import validateRequestBody from '../middlewares/validateRequestBody';
import { noteSchema } from '../schemas';
import isAuthenticated from '../middlewares/isAuthenticated';

const router = Router();

/**
 * Retrieves notes for a specific video.
 *
 * @route GET /videos/:video_id/notes
 * @returns {Array<Note>} An array of notes for the specified video.
 */
router.route('/videos/:video_id/notes').get(isAuthenticated, getVideoNotes);

/**
 * Creates a new note for a specific video.
 *
 * @route POST /videos/:video_id/notes
 * @param {Note} noteData - The data of the note to be created.
 * @returns {Note} The created note.
 */
router
  .route('/videos/:video_id/notes')
  .post(
    isAuthenticated,
    checkVideoExists,
    validateRequestBody(noteSchema),
    createVideoNote,
  );

export default router;
