import { Router } from 'express';

import {
  createNote,
  getUserNotes,
  deleteNote,
  getNoteById,
  updateNote,
  getUserRecentNotes,
  getUserRecentlyUpdatedNotes,
} from '../controllers/note.controller';

import isAuthenticated from '../middlewares/isAuthenticated';
import validateRequestBody from '../middlewares/validateRequestBody';

import { noteSchema } from '../schemas/note.schema';

const router = Router();

router
  .route('/')
  .post(isAuthenticated, validateRequestBody(noteSchema), createNote);

router.route('/').get(isAuthenticated, getUserNotes);

router.route('/:noteId').delete(isAuthenticated, deleteNote);

router.route('/:noteId').post(isAuthenticated, getNoteById);

router.route('/:noteId').patch(isAuthenticated, updateNote);

router.route('/recent').get(isAuthenticated, getUserRecentNotes);

router
  .route('/recently-updated')
  .get(isAuthenticated, getUserRecentlyUpdatedNotes);

export default router;
