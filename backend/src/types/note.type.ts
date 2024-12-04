import type { z } from "zod";
import type { noteSchema, updateNoteSchema } from "../schemas/note.schema";

export type NoteBody = z.infer<typeof noteSchema.body>;

export type UpdateNoteBody = z.infer<typeof updateNoteSchema.body>;
