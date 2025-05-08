"use client";

import {
  useAuthStore,
  useNoteStore,
  useUIStore,
  useUserStore,
  useVideoStore,
} from "@/stores";
import { useCallback } from "react";

/**
 * This hook combines access to multiple stores for components that need data from different domains.
 * It helps prevent unnecessary re-renders by only selecting the specific pieces of state needed.
 */
export function useCombinedState() {
  // Select only what's needed from each store
  const isAuthenticated = useAuthStore(
    (state) => state.status === "authenticated"
  );
  const currentUser = useUserStore((state) => state.currentUser);
  const currentVideo = useVideoStore((state) => state.currentVideo);
  const notes = useNoteStore((state) => state.notes);
  const selectedNoteId = useNoteStore((state) => state.selectedNoteId);
  const isGridLayout = useUIStore((state) => state.layout.isGridLayout);

  // Store actions
  const noteActions = useNoteStore((state) => state.actions);
  const videoActions = useVideoStore((state) => state.actions);
  const uiActions = useUIStore((state) => state.actions);

  // Create memoized action functions
  const selectNote = useCallback(
    (id: string | null) => {
      noteActions.selectNote(id);
    },
    [noteActions]
  );

  const setCurrentVideo = useCallback(
    (video: any) => {
      videoActions.setCurrentVideo(video);
    },
    [videoActions]
  );

  const toggleLayout = useCallback(() => {
    uiActions.toggleLayout();
  }, [uiActions]);

  return {
    // Auth & User state
    isAuthenticated,
    currentUser,

    // Video state
    currentVideo,

    // Note state
    notes,
    selectedNoteId,

    // UI state
    isGridLayout,

    // Actions
    selectNote,
    setCurrentVideo,
    toggleLayout,
  };
}
