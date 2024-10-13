import { Router } from 'express';

import {
  createNote,
  getUserNotes,
  deleteNote,
  getNoteById,
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

export default router;
