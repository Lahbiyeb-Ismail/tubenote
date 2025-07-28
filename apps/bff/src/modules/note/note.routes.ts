import { createNoteSchema, idParamSchema, paginationQuerySchema, searchAndPaginationQuerySchema, updateNoteSchema } from "@tubenote/schemas";
import { Router } from "express";

import { validateSessionMiddleware } from "@/middlewares/auth";
import { validateRequest } from "@/middlewares/validation";

import { NoteController } from "./note.controller";

const noteController = new NoteController();

const noteRoutes: Router = Router();

noteRoutes.use(validateSessionMiddleware);

noteRoutes
  .route("/count/:id")
  .get(validateRequest({ params: idParamSchema }), noteController.getNotesCountByYtVideoId);

noteRoutes.route("/video/:id").get(
  validateRequest({
    params: idParamSchema,
    query: paginationQuerySchema,
  }),
  noteController.getNotesByVideoId,
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
  .get(validateRequest({ query: searchAndPaginationQuerySchema }), noteController.getUserNotes);

export { noteRoutes };
