"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

import { useNoteStore } from "@/stores/note-store";
import { useCreateNote, useDeleteNote, useUpdateNote } from "../hooks";
import { noteInitialState, noteReducer } from "../reducers";
import type { NoteContextType, NoteProviderProps } from "../types";

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export function NoteProvider({ children }: NoteProviderProps) {
  const [state, dispatch] = useReducer(noteReducer, noteInitialState);

  // Access the Zustand store actions
  const noteActions = useNoteStore((state) => state.actions);

  // Connect React Query mutations to dispatch actions
  const createNoteMutation = useCreateNote(dispatch);
  const deleteNoteMutation = useDeleteNote();
  const updateNoteMutation = useUpdateNote(dispatch);

  // Sync reducer state with Zustand store
  useEffect(() => {
    // Update loading state
    noteActions.setLoading(
      createNoteMutation.isPending ||
        deleteNoteMutation.isPending ||
        updateNoteMutation.isPending
    );

    // Update error state if any mutation has an error
    const error =
      createNoteMutation.error ||
      deleteNoteMutation.error ||
      updateNoteMutation.error;

    if (error) {
      noteActions.setError(
        error instanceof Error ? error : new Error(String(error))
      );
    } else {
      noteActions.setError(null);
    }
  }, [
    noteActions,
    createNoteMutation.isPending,
    deleteNoteMutation.isPending,
    updateNoteMutation.isPending,
    createNoteMutation.error,
    deleteNoteMutation.error,
    updateNoteMutation.error,
  ]);

  // Sync specific state properties with Zustand
  // useEffect(() => {
  //   noteActions.setCreating(state.isCreatingNote);
  //   noteActions.setEditing(state.isEditingNote);
  // }, [state.isCreatingNote, state.isEditingNote, noteActions]);

  // const clearNoteState = () => {
  //   dispatch({ type: "CLEAR_NOTE_STATE" });
  //   noteActions.selectNote(null);
  // };

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      state,
      createNote: createNoteMutation.mutate,
      isLoading: createNoteMutation.isPending || deleteNoteMutation.isPending,
      deleteNote: deleteNoteMutation.mutate,
      updateNote: updateNoteMutation.mutate,
    }),
    [
      state,
      createNoteMutation.mutate,
      createNoteMutation.isPending,
      deleteNoteMutation.mutate,
      deleteNoteMutation.isPending,
      updateNoteMutation.mutate,
    ]
  );

  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
}

export function useNote() {
  const context = useContext(NoteContext);

  if (context === undefined) {
    throw new Error("useNote must be used within an NoteProvider");
  }

  return context;
}

// Create a simplified hook for components that only need to read note state
export function useNoteState() {
  const { notes, selectedNoteId, isCreating, isEditing, error, isLoading } =
    useNoteStore();

  return {
    notes,
    selectedNoteId,
    isCreating,
    isEditing,
    error,
    isLoading,
  };
}
