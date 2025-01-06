import { Router } from "express";

import isAuthenticated from "../../middlewares/isAuthenticated";
import validateRequest from "../../middlewares/validateRequest";

import NoteController from "./note.controller";

import { idParamSchema } from "../../common/schemas/id-param.schema";
import { paginationSchema } from "../../common/schemas/query-pagination.schema";
import { createNoteSchema } from "./schemas/create-note.schema";
import { updateNoteSchema } from "./schemas/update-note.schema";

const router = Router();

// - isAuthenticated: Ensures the user is authenticated before accessing any note routes.
router.use(isAuthenticated);

// - GET /: Get all notes for the authenticated user.
// - POST /: Create a new note (requires request body validation).
router
  .route("/")
  .get(
    validateRequest({ query: paginationSchema }),
    NoteController.getUserNotes
  )
  .post(validateRequest({ body: createNoteSchema }), NoteController.createNote);

// - GET /recent: Get the most recent notes for the authenticated user.
router.route("/recent").get(NoteController.getUserRecentNotes);

// - GET /recently-updated: Get the recently updated notes for the authenticated user.
router.route("/recently-updated").get(NoteController.getRecentlyUpatedNotes);

// - GET /video/:id: Get all notes for a specific video (requires request params validation).
router.route("/video/:id").get(
  validateRequest({
    params: idParamSchema,
    query: paginationSchema,
  }),
  NoteController.getNotesByVideoId
);

// - GET /:id: Get a specific note by its ID (requires request params validation).
// - PATCH /:id: Update a specific note by its ID (requires request params validation).
// - DELETE /:id: Delete a specific note by its ID (requires request params validation).
router
  .route("/:id")
  .all(validateRequest({ params: idParamSchema }))
  .patch(validateRequest({ body: updateNoteSchema }), NoteController.updateNote)
  .get(NoteController.getNoteById)
  .delete(NoteController.deleteNote);

export default router;
