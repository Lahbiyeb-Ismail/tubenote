"use client";

import { createContext, useContext, useReducer } from "react";

import { useCreateNote, useDeleteNote, useUpdateNote } from "../hooks";
import { noteInitialState, noteReducer } from "../reducers";
import type { NoteContextType, NoteProviderProps } from "../types";

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export function NoteProvider({ children }: NoteProviderProps) {
  const [state, dispatch] = useReducer(noteReducer, noteInitialState);

  const createNoteMutation = useCreateNote(dispatch);
  const deleteNoteMutation = useDeleteNote();
  const updateNoteMutation = useUpdateNote(dispatch);

  const clearNoteState = () => {
    dispatch({ type: "CLEAR_NOTE_STATE" });
  };

  const value = {
    state,
    createNote: createNoteMutation.mutate,
    isLoading: createNoteMutation.isPending || deleteNoteMutation.isPending,
    deleteNote: deleteNoteMutation.mutate,
    updateNote: updateNoteMutation.mutate,
    clearNoteState,
  };

  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
}

export function useNote() {
  const context = useContext(NoteContext);

  if (context === undefined) {
    throw new Error("useNote must be used within an NoteProvider");
  }

  return context;
}
