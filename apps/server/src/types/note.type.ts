import type {
  noteBodySchema,
  noteIdParamSchema,
  updateNoteBodySchema,
} from "../schemas/note.schema";

import type { NoteId, UserId } from "./shared.types";

export type NoteBody = typeof noteBodySchema;

export type UpdateNoteBody = typeof updateNoteBodySchema;

export type NoteIdParam = typeof noteIdParamSchema;

export interface NoteEntry {
  id: string;
  userId: string;
  videoId: string;
  youtubeId: string;
  title: string;
  content: string;
  videoTitle: string;
  thumbnail: string;
  timestamp: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface FindNoteParams extends UserId, NoteId {}
export interface CreateNoteParams {
  data: Omit<NoteEntry, "id" | "createdAt" | "updatedAt">;
}
export interface DeleteNoteParams extends UserId, NoteId {}

export interface UpdateNoteParams extends UserId, NoteId {
  data: Omit<NoteEntry, "id" | "userId" | "createdAt" | "updatedAt">;
}

export interface UserNotes {
  notes: NoteEntry[];
  notesCount: number;
  totalPages: number;
}
