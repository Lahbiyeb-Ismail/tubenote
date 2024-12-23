import { Router } from "express";

import isAuthenticated from "../../middlewares/isAuthenticated";
import validateRequest from "../../middlewares/validateRequest";

import NoteController from "./noteController";

import { paginationQuerySchema } from "../../schemas";

import {
  noteBodySchema,
  noteIdParamSchema,
  updateNoteBodySchema,
} from "./noteValidationSchemas";

import { videoIdParamSchema } from "../video/videoValidationSchemas";

const router = Router();

// - isAuthenticated: Ensures the user is authenticated before accessing any note routes.
router.use(isAuthenticated);

// - GET /: Get all notes for the authenticated user.
// - POST /: Create a new note (requires request body validation).
router
  .route("/")
  .get(
    validateRequest({ query: paginationQuerySchema }),
    NoteController.getUserNotes
  )
  .post(validateRequest({ body: noteBodySchema }), NoteController.addNewNote);

// - GET /recent: Get the most recent notes for the authenticated user.
router.route("/recent").get(NoteController.getUserRecentNotes);

// - GET /recently-updated: Get the recently updated notes for the authenticated user.
router.route("/recently-updated").get(NoteController.getRecentlyUpatedNotes);

// - GET /video/:videoId: Get all notes for a specific video (requires request params validation).
router.route("/video/:videoId").get(
  validateRequest({
    params: videoIdParamSchema,
    query: paginationQuerySchema,
  }),
  NoteController.getNotesByVideoId
);

// - GET /:noteId: Get a specific note by its ID (requires request params validation).
// - PATCH /:noteId: Update a specific note by its ID (requires request params validation).
// - DELETE /:noteId: Delete a specific note by its ID (requires request params validation).
router
  .route("/:noteId")
  .all(validateRequest({ params: noteIdParamSchema }))
  .patch(
    validateRequest({ body: updateNoteBodySchema }),
    NoteController.updateNote
  )
  .get(NoteController.getNoteById)
  .delete(NoteController.deleteNote);

export default router;
