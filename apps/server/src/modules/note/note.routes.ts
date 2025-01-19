import { Router } from "express";

import isAuthenticated from "@middlewares/auth.middleware";
import validateRequest from "@middlewares/validate-request.middleware";

import { noteController } from "./note.module";

import { idParamSchema } from "@common/schemas/id-param.schema";
import { paginationSchema } from "@common/schemas/query-pagination.schema";

import { createNoteSchema } from "./schemas/create-note.schema";
import { updateNoteSchema } from "./schemas/update-note.schema";

const router = Router();

// - isAuthenticated: Ensures the user is authenticated before accessing any note routes.
router.use(isAuthenticated);

// - GET /: Get all notes for the authenticated user.
// - POST /: Create a new note (requires request body validation).
router
  .route("/")
  .get(validateRequest({ query: paginationSchema }), (req, res) =>
    noteController.getUserNotes(req, res)
  )
  .post(validateRequest({ body: createNoteSchema }), (req, res) =>
    noteController.createNote(req, res)
  );

// - GET /recent: Get the most recent notes for the authenticated user.
router
  .route("/recent")
  .get((req, res) => noteController.getUserRecentNotes(req, res));

// - GET /recently-updated: Get the recently updated notes for the authenticated user.
router
  .route("/recently-updated")
  .get((req, res) => noteController.getRecentlyUpatedNotes(req, res));

// - GET /video/:id: Get all notes for a specific video (requires request params validation).
router.route("/video/:id").get(
  validateRequest({
    params: idParamSchema,
    query: paginationSchema,
  }),
  (req, res) => noteController.getNotesByVideoId(req, res)
);

// - GET /:id: Get a specific note by its ID (requires request params validation).
// - PATCH /:id: Update a specific note by its ID (requires request params validation).
// - DELETE /:id: Delete a specific note by its ID (requires request params validation).
router
  .route("/:id")
  .all(validateRequest({ params: idParamSchema }))
  .patch(validateRequest({ body: updateNoteSchema }), (req, res) =>
    noteController.updateNote(req, res)
  )
  .get((req, res) => noteController.getNoteById(req, res))
  .delete((req, res) => noteController.deleteNote(req, res));

export default router;
