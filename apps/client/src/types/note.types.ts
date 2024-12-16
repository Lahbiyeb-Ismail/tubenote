import type { z } from "zod";

import type { saveNoteFormSchema, videoFormSchema } from "@/lib/schemas";
import type { ReactNode } from "react";

export type VideoUrl = z.infer<typeof videoFormSchema>;

export type NoteTitle = z.infer<typeof saveNoteFormSchema>;

export type Note = {
  id: string;
  title: string;
  content: string;
  videoId: string;
  thumbnail: string;
  videoTitle: string;
  youtubeId: string;
  createdAt: string;
  updatedAt: string;
  timestamp: Timestamp;
};

export type NoteProviderProps = {
  children: ReactNode;
};

export type NoteState = {
  note: Note | null;
  message: string | null;
  success: boolean;
};

export type NewNote = Omit<Note, "id" | "createdAt" | "updatedAt">;

export type NoteContextType = {
  state: NoteState;
  createNote: (note: NewNote) => void;
  isLoading: boolean;
  deleteNote: (noteId: string) => void;
  updateNote: (note: UpdateNoteProps) => void;
  clearNoteState: () => void;
};

export type NoteAction =
  | {
      type: "CREATE_NOTE_SUCCESS";
      payload: { message: string; note: Note; success: true };
    }
  | { type: "CREATE_NOTE_FAIL"; payload: { message: string; success: false } }
  | {
      type: "GET_NOTE_SUCCESS";
      payload: { note: Note; success: true };
    }
  | { type: "GET_NOTE_FAIL"; payload: { message: string; success: false } }
  | {
      type: "UPDATE_NOTE_SUCCESS";
      payload: { note: Note; success: true };
    }
  | { type: "UPDATE_NOTE_FAIL"; payload: { message: string; success: false } }
  | { type: "CLEAR_NOTE_STATE" };

export type Timestamp = {
  start: number;
  end: number;
};

export type CreateNoteResponse = {
  message: string;
  note: Note;
};

export type UpdateNoteProps = {
  noteId: string;
  title: string;
  content: string;
  timestamp: Timestamp;
};
