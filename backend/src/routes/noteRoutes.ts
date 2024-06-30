import { Router } from 'express';

import {
  createVideoNote,
  getNoteById,
  getUserNotes,
  updateVideoNote,
} from '../controllers/noteControllers';
import validateRequestBody from '../middlewares/validateRequestBody';
import { noteSchema, updateNoteSchema } from '../schemas';
import checkNoteExists from '../middlewares/checkNoteExists';

const router = Router();

/**
 * Retrieves notes for a specific video.
 *
 * @route GET /videos/:video_id/notes
 * @returns {Array<Note>} An array of notes for the specified video.
 */
router.route('/notes/:user_id').get(getUserNotes);

/**
 * Creates a new note for a specific video.
 *
 * @route POST /videos/:video_id/notes
 * @param {Note} noteData - The data of the note to be created.
 * @returns {Note} The created note.
 */
router.route('/notes').post(validateRequestBody(noteSchema), createVideoNote);

router.route('/notes/note/:note_id').get(getNoteById);

router
  .route('/notes/:note_id')
  .patch(
    checkNoteExists,
    validateRequestBody(updateNoteSchema),
    updateVideoNote,
  );

export default router;
