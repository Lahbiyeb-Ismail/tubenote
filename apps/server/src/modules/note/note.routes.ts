import { Router } from "express";

import { isAuthenticated, validateRequest } from "@/middlewares";

import { idParamSchema, paginationQuerySchema } from "@/modules/shared/schemas";

import { noteController } from "./note.module";
import { createNoteSchema, updateNoteSchema } from "./schemas";

const noteRoutes = Router();

// - isAuthenticated: Ensures the user is authenticated before accessing any note routes.
noteRoutes.use(isAuthenticated);

// - GET /: Get all notes for the authenticated user.
// - POST /: Create a new note (requires request body validation).
noteRoutes
  .route("/")
  .get(validateRequest({ query: paginationQuerySchema }), (req, res) =>
    noteController.getUserNotes(req, res)
  )
  .post(validateRequest({ body: createNoteSchema }), (req, res) =>
    noteController.createNote(req, res)
  );

// - GET /recent: Get the most recent notes for the authenticated user.
noteRoutes
  .route("/recent")
  .get((req, res) => noteController.getUserRecentNotes(req, res));

// - GET /recently-updated: Get the recently updated notes for the authenticated user.
noteRoutes
  .route("/recently-updated")
  .get((req, res) => noteController.getRecentlyUpdatedNotes(req, res));

// - GET /video/:id: Get all notes for a specific video (requires request params validation).
noteRoutes.route("/video/:id").get(
  validateRequest({
    params: idParamSchema,
    query: paginationQuerySchema,
  }),
  (req, res) => noteController.getNotesByVideoId(req, res)
);

// - GET /:id: Get a specific note by its ID (requires request params validation).
// - PATCH /:id: Update a specific note by its ID (requires request params validation).
// - DELETE /:id: Delete a specific note by its ID (requires request params validation).
noteRoutes
  .route("/:id")
  .all(validateRequest({ params: idParamSchema }))
  .patch(validateRequest({ body: updateNoteSchema }), (req, res) =>
    noteController.updateNote(req, res)
  )
  .get((req, res) => noteController.getNoteById(req, res))
  .delete((req, res) => noteController.deleteNote(req, res));

export { noteRoutes };
