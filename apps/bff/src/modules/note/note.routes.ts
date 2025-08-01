import { createNoteSchema, idParamSchema, searchAndPaginationQuerySchema, updateNoteSchema } from "@tubenote/schemas";
import { Router } from "express";

import { validateSessionMiddleware } from "@/middlewares/auth";
import { validateRequest } from "@/middlewares/validation";

import { NoteController } from "./note.controller";

/**
 * Note routes module that defines all HTTP endpoints for note-related operations.
 * All routes require session validation middleware for authentication.
 *
 * @module NoteRoutes
 *
 * Routes:
 * - GET /count/:id - Get count of notes for a specific YouTube video ID
 * - GET /video/:id - Get paginated notes for a specific video with search capability
 * - GET /:id - Get a specific note by ID
 * - DELETE /:id - Delete a specific note by ID
 * - POST /:id - Create a new note for a specific video
 * - PATCH /:id - Update an existing note
 * - GET / - Get paginated user notes with search capability
 *
 * @requires validateSessionMiddleware - Applied to all routes for authentication
 * @uses NoteController - Controller instance handling business logic
 * @validation Uses various schemas for request validation:
 *   - idParamSchema: Validates ID parameters
 *   - searchAndPaginationQuerySchema: Validates search and pagination query parameters
 *   - createNoteSchema: Validates note creation request body
 *   - updateNoteSchema: Validates note update request body
 */
const noteRoutes: Router = Router();

const noteController = new NoteController();

noteRoutes.use(validateSessionMiddleware);

noteRoutes
  .route("/count/:id")
  .get(validateRequest({ params: idParamSchema }), noteController.getNotesCountByYtVideoId);

noteRoutes.route("/video/:id").get(
  validateRequest({
    params: idParamSchema,
    query: searchAndPaginationQuerySchema,
  }),
  noteController.getNotesByVideoId as any,
);

noteRoutes
  .route("/:id")
  .all(validateRequest({ params: idParamSchema }))
  .get(noteController.getNoteById)
  .delete(noteController.deleteNote)
  .post(validateRequest({ body: createNoteSchema }), noteController.createNote)
  .patch(validateRequest({ body: updateNoteSchema }), noteController.updateNote);

noteRoutes
  .route("/")
  .get(validateRequest({ query: searchAndPaginationQuerySchema }), noteController.getUserNotes as any);

export { noteRoutes };
