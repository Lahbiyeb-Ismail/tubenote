"use client";

import { Note } from "@tubenote/types";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface NoteState {
  notes: Note[];
  selectedNoteId: string | null;
  isCreating: boolean;
  isEditing: boolean;
  error: Error | null;
  isLoading: boolean;
}

interface NoteStore extends NoteState {
  actions: {
    setNotes: (notes: Note[]) => void;
    addNote: (note: Note) => void;
    updateNote: (id: string, updates: Partial<Note>) => void;
    deleteNote: (id: string) => void;
    selectNote: (id: string | null) => void;
    setCreating: (isCreating: boolean) => void;
    setEditing: (isEditing: boolean) => void;
    setError: (error: Error | null) => void;
    setLoading: (isLoading: boolean) => void;
  };
}

export const useNoteStore = create<NoteStore>()(
  immer((set) => ({
    notes: [],
    selectedNoteId: null,
    isCreating: false,
    isEditing: false,
    error: null,
    isLoading: false,

    actions: {
      setNotes: (notes) =>
        set((state) => {
          state.notes = notes;
        }),

      addNote: (note) =>
        set((state) => {
          state.notes.push(note);
        }),

      updateNote: (id, updates) =>
        set((state) => {
          const index = state.notes.findIndex((note) => note.id === id);
          if (index !== -1) {
            state.notes[index] = { ...state.notes[index], ...updates };
          }
        }),

      deleteNote: (id) =>
        set((state) => {
          state.notes = state.notes.filter((note) => note.id !== id);
          if (state.selectedNoteId === id) {
            state.selectedNoteId = null;
          }
        }),

      selectNote: (id) =>
        set((state) => {
          state.selectedNoteId = id;
        }),

      setCreating: (isCreating) =>
        set((state) => {
          state.isCreating = isCreating;
        }),

      setEditing: (isEditing) =>
        set((state) => {
          state.isEditing = isEditing;
        }),

      setError: (error) =>
        set((state) => {
          state.error = error;
        }),

      setLoading: (isLoading) =>
        set((state) => {
          state.isLoading = isLoading;
        }),
    },
  }))
);
