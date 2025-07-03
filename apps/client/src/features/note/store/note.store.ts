"use client";

import type { Note } from "@tubenote/db";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface NoteState {
  note: Note | undefined;
  selectedNoteId: string | null;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: Error | null;
  isLoading: boolean;
}

interface NoteStore extends NoteState {
  noteActions: {
    setNote: (note: Note | undefined) => void;
    setNoteId: (id: string | null) => void;
    setCreating: (isCreating: boolean) => void;
    setUpdating: (isUpdating: boolean) => void;
    setDeleting: (isDeleting: boolean) => void;
    setError: (error: Error | null) => void;
    setLoading: (isLoading: boolean) => void;
  };
}

export const useNoteStore = create<NoteStore>()(
  immer(set => ({
    note: undefined,
    selectedNoteId: null,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: null,
    isLoading: false,

    noteActions: {
      setNote: (note: Note | undefined) =>
        set((state) => {
          state.note = note;
        }),

      setNoteId: id =>
        set((state) => {
          state.selectedNoteId = id;
        }),

      setCreating: isCreating =>
        set((state) => {
          state.isCreating = isCreating;
        }),

      setUpdating: isUpdating =>
        set((state) => {
          state.isUpdating = isUpdating;
        }),

      setDeleting: isDeleting =>
        set((state) => {
          state.isDeleting = isDeleting;
        }),

      setError: error =>
        set((state) => {
          state.error = error;
        }),

      setLoading: isLoading =>
        set((state) => {
          state.isLoading = isLoading;
        }),
    },
  })),
);
