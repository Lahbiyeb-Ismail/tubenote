import type { z } from 'zod';

import type { saveNoteFormSchema, videoFormSchema } from '@/lib/schemas';
import type { ReactNode } from 'react';

export type VideoUrl = z.infer<typeof videoFormSchema>;

export type NoteTitle = z.infer<typeof saveNoteFormSchema>;

export type Note = {
  title: string;
  content: string;
  videoId?: string;
  thumbnail?: string;
  videoTitle?: string;
};

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
  createNote: (note: Note) => void;
  isLoading: boolean;
};

export type NoteAction =
  | {
      type: 'CREATE_NOTE_SUCCESS';
      payload: { message: string; note: Note; success: true };
    }
  | { type: 'CREATE_NOTE_FAIL'; payload: { message: string; success: false } };

export type CreateNoteResponse = {
  message: string;
  note: Note;
};
