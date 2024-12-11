import type {
  noteBodySchema,
  noteIdParamSchema,
  updateNoteBodySchema,
} from "../schemas/note.schema";

export type NoteBody = typeof noteBodySchema;

export type UpdateNoteBody = typeof updateNoteBodySchema;

export type NoteIdParam = typeof noteIdParamSchema;
