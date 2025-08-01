import { Router } from "express";

import { validateSessionMiddleware } from "@/middlewares/auth";

import { NoteController } from "./note.controller";

const noteController = new NoteController();

const noteRoutes: Router = Router();

noteRoutes.use(validateSessionMiddleware);

noteRoutes
  .route("/count/:id")
  .get(noteController.getNotesCountByYtVideoId);

noteRoutes.route("/video/:id").get(
  noteController.getNotesByVideoId,
);

noteRoutes
  .route("/:id")
  .post(noteController.createNote)
  .patch(noteController.updateNote)
  .get(noteController.getNoteById)
  .delete(noteController.deleteNote);

noteRoutes
  .route("/")
  .get(noteController.getUserNotes);

export { noteRoutes };
