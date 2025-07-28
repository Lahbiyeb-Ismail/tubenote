import { Router } from "express";

import { isAuthenticated } from "@/middlewares";

import { noteController } from "./note.module";

const noteRoutes: Router = Router();

// - isAuthenticated: Ensures the user is authenticated before accessing any note routes.
noteRoutes.use(isAuthenticated);

// - GET /recent: Get the most recent notes for the authenticated user.
noteRoutes
  .route("/count/:id")
  .get((req, res) => noteController.getNotesCountByVideoId(req, res));

// - GET /video/:id: Get all notes for a specific video (requires request params validation).
noteRoutes.route("/video/:id").get(
  (req, res) => noteController.getNotesByVideoId(req as any, res),
);

// - GET /:id: Get a specific note by its ID (requires request params validation).
// - POST /:id: Create a new note for a specific video (requires request params validation).
// - PATCH /:id: Update a specific note by its ID (requires request params validation).
// - DELETE /:id: Delete a specific note by its ID (requires request params validation).
noteRoutes
  .route("/:id")
  .post((req, res) => noteController.createNote(req, res))
  .patch((req, res) =>
    noteController.updateNote(req, res))
  .get((req, res) => noteController.getNoteById(req, res))
  .delete((req, res) => noteController.deleteNote(req, res));

// - GET /: Get all notes for the authenticated user.
noteRoutes
  .route("/")
  .get((req, res) =>
    noteController.getUserNotes(req as any, res));

export { noteRoutes };
