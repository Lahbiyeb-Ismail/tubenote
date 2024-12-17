import { Router } from "express";

import {
  createNote,
  deleteNote,
  getNoteById,
  getUserNotes,
  getUserRecentNotes,
  getUserRecentlyUpdatedNotes,
  updateNote,
} from "../controllers/note.controller";

import isAuthenticated from "../middlewares/isAuthenticated";
import validateRequest from "../middlewares/validateRequest";

import noteController from "../controllers/noteController";
import { paginationQuerySchema } from "../schemas";
import {
  noteBodySchema,
  noteIdParamSchema,
  updateNoteBodySchema,
} from "../schemas/note.schema";

const router = Router();

// - isAuthenticated: Ensures the user is authenticated before accessing any note routes.
router.use(isAuthenticated);

// - GET /: Get all notes for the authenticated user.
// - POST /: Create a new note (requires request body validation).
router
  .route("/")
  .get(
    validateRequest({ query: paginationQuerySchema }),
    noteController.getUserNotes
  )
  .post(validateRequest({ body: noteBodySchema }), noteController.addNewNote);

// - GET /recent: Get the most recent notes for the authenticated user.
router.route("/recent").get(noteController.getUserRecentNotes);

// - GET /recently-updated: Get the recently updated notes for the authenticated user.
router.route("/recently-updated").get(getUserRecentlyUpdatedNotes);

// - GET /:noteId: Get a specific note by its ID (requires request params validation).
// - PATCH /:noteId: Update a specific note by its ID (requires request params validation).
// - DELETE /:noteId: Delete a specific note by its ID (requires request params validation).
router
  .route("/:noteId")
  .all(validateRequest({ params: noteIdParamSchema }))
  .patch(
    validateRequest({ body: updateNoteBodySchema }),
    noteController.updateNote
  )
  .get(noteController.getNoteById)
  .delete(noteController.deleteNote);

export default router;
