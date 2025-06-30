"use client";

import type { Note } from "@tubenote/db";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface VideoNoteStore {
  activeNote: Note | undefined;
  currentNoteIndex: number;
  playId: number;
  setActiveNote: (note: Note | undefined) => void;
  setCurrentNoteIndex: (index: number) => void;
}

export const useVideoNoteStore = create<VideoNoteStore>()(
  immer(set => ({
    activeNote: undefined,
    currentNoteIndex: 0,
    playId: 0,

    setActiveNote: (note: Note | undefined) =>
      set((state) => {
        state.activeNote = note;
        state.playId = state.playId + 1;
      }),

    setCurrentNoteIndex: index =>
      set((state) => {
        state.currentNoteIndex = index;
      }),
  })),
);
