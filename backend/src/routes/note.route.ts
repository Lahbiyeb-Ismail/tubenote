import { Router } from 'express';

import { createNote, getUserNotes, deleteNote } from '../controllers/note.controller';

import isAuthenticated from '../middlewares/isAuthenticated';
import validateRequestBody from '../middlewares/validateRequestBody';

import { noteSchema } from '../schemas/note.schema';

const router = Router();

router
  .route('/')
  .post(isAuthenticated, validateRequestBody(noteSchema), createNote);

router.route('/').get(isAuthenticated, getUserNotes);

router.route('/:noteId').delete(isAuthenticated, deleteNote);

export default router;
