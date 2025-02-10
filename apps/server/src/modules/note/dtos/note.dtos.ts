import type { Note } from "../note.model";

export interface CreateNoteDto
  extends Omit<Note, "id" | "createAt" | "updatedAt"> {}

export interface UpdateNoteDto
  extends Partial<Pick<Note, "title" | "content" | "timestamp">> {}

export interface FindNoteDto {
  noteId: string;
  userId: string;
}

export interface DeleteNoteDto {
  noteId: string;
  userId: string;
}

export interface NoteIdDto {
  noteId: string;
}
