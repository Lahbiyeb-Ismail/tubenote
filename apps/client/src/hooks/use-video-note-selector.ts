"use client";

import { useNoteStore, useVideoStore } from "@/stores";
import type { Note } from "@tubenote/types";
import { useCallback, useMemo } from "react";
import { shallow } from "zustand/shallow";

/**
 * This hook demonstrates an optimized selector pattern using Zustand's shallow comparison
 * to only re-render when the selected data actually changes.
 */
export function useVideoNoteSelector(videoId?: string) {
  // Select only the specific state needed from each store
  const {
    currentVideo,
    isLoading: videoLoading,
    error: videoError,
  } = useVideoStore(
    (state) => ({
      currentVideo: state.currentVideo,
      isLoading: state.isLoading,
      error: state.error,
    }),
    shallow // Use shallow comparison to prevent unnecessary re-renders
  );

  // Select notes related to the current video
  const {
    notes,
    selectedNoteId,
    isCreating,
    isEditing,
    isLoading: noteLoading,
  } = useNoteStore(
    (state) => ({
      notes: state.notes.filter(
        (note) =>
          note.videoId === videoId ||
          (currentVideo && note.videoId === currentVideo.id)
      ),
      selectedNoteId: state.selectedNoteId,
      isCreating: state.isCreating,
      isEditing: state.isEditing,
      isLoading: state.isLoading,
    }),
    shallow
  );

  // Get actions from stores
  const noteActions = useNoteStore((state) => state.actions);
  const _videoActions = useVideoStore((state) => state.actions);

  // Memoized actions
  const selectNote = useCallback(
    (id: string | null) => {
      noteActions.selectNote(id);
    },
    [noteActions]
  );

  const createNote = useCallback(
    (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
      noteActions.setCreating(true);
      // Here you would typically call your API and then update the store
      // This is a placeholder for the actual implementation
      console.log("Creating note:", note);
    },
    [noteActions]
  );

  const updateNote = useCallback(
    (id: string, updates: Partial<Note>) => {
      noteActions.updateNote(id, updates);
    },
    [noteActions]
  );

  const deleteNote = useCallback(
    (id: string) => {
      noteActions.deleteNote(id);
    },
    [noteActions]
  );

  // Derived/computed values
  const selectedNote = useMemo(() => {
    return notes.find((note) => note.id === selectedNoteId) || null;
  }, [notes, selectedNoteId]);

  const isLoading = videoLoading || noteLoading;

  return {
    // Video state
    currentVideo,
    videoLoading,
    videoError,

    // Note state
    notes,
    selectedNote,
    selectedNoteId,
    isCreating,
    isEditing,
    noteLoading,

    // Combined state
    isLoading,

    // Actions
    selectNote,
    createNote,
    updateNote,
    deleteNote,
  };
}
