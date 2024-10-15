import type { z } from 'zod';

import type { saveNoteFormSchema, videoFormSchema } from '@/lib/schemas';
import type { ReactNode } from 'react';

export type VideoUrl = z.infer<typeof videoFormSchema>;

export type NoteTitle = z.infer<typeof saveNoteFormSchema>;

export type Note = {
  title: string;
  content: string;
  timestamp?: number;
  videoId?: string;
  thumbnail?: string;
  videoTitle?: string;
  youtubeId?: string;
};

export type NoteProviderProps = {
  children: ReactNode;
};

export type NoteState = {
  note: INote | null;
  message: string | null;
  success: boolean;
};

export type NoteContextType = {
  state: NoteState;
  createNote: (note: Note) => void;
  isLoading: boolean;
  deleteNote: (noteId: string) => void;
  getNote: (noteId: string) => void;
  updateNote: (note: UpdateNoteProps) => void;
};

export type NoteAction =
  | {
      type: 'CREATE_NOTE_SUCCESS';
      payload: { message: string; note: Note; success: true };
    }
  | { type: 'CREATE_NOTE_FAIL'; payload: { message: string; success: false } }
  | {
      type: 'GET_NOTE_SUCCESS';
      payload: { note: INote; success: true };
    }
  | { type: 'GET_NOTE_FAIL'; payload: { message: string; success: false } }
  | {
      type: 'UPDATE_NOTE_SUCCESS';
      payload: { note: INote; success: true };
    }
  | { type: 'UPDATE_NOTE_FAIL'; payload: { message: string; success: false } };

export interface INote extends Note {
  id: string;
  createdAt: string;
}

export type CreateNoteResponse = {
  message: string;
  note: INote;
};

export type UpdateNoteProps = {
  noteId?: string;
  title: string;
  content: string;
  timestamp?: number;
};
