import type { z } from "zod";

import type { ReactNode } from "react";

import type { ICreateNoteDto, IUpdateNoteDto } from "@tubenote/dtos";
import type { Note } from "@tubenote/types";

import type { saveNoteFormSchema, videoFormSchema } from "@/lib";

export type VideoUrl = z.infer<typeof videoFormSchema>;

export type NoteTitle = z.infer<typeof saveNoteFormSchema>;

export type NoteProviderProps = {
  children: ReactNode;
};

export type NoteState = {
  note: Note | null;
  message: string | null;
  success: boolean;
};

export type NoteContextType = {
  state: NoteState;
  createNote: ({
    videoId,
    createNoteData,
  }: { videoId: string; createNoteData: ICreateNoteDto }) => void;
  isLoading: boolean;
  deleteNote: (noteId: string) => void;
  updateNote: ({
    noteId,
    updateData,
  }: { noteId: string; updateData: IUpdateNoteDto }) => void;
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
