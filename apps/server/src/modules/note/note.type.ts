import type { NoteDto } from "./dtos/note.dto";

export interface UserNotes {
  notes: NoteDto[];
  notesCount: number;
  totalPages: number;
}
