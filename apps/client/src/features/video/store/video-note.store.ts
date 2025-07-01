"use client";

import type { Note, Timestamp } from "@tubenote/db";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface VideoNoteStore {
  activeNote: Note | undefined;
  currentNoteIndex: number;
  playId: number;
  noteTimestamp: Timestamp;
  isSyncing: boolean;
  setActiveNote: (note: Note | undefined) => void;
  setCurrentNoteIndex: (index: number) => void;
  startNoteSync: () => void;
  stopNoteSync: () => void;
  setNoteStartTime: (time: number) => void;
  setNoteEndTime: (time: number) => void;
}

export const useVideoNoteStore = create<VideoNoteStore>()(
  immer(set => ({
    activeNote: undefined,
    currentNoteIndex: 0,
    playId: 0,
    isSyncing: false,
    noteTimestamp: {
      start: 0,
      end: 0,
    },

    setActiveNote: (note: Note | undefined) =>
      set((state) => {
        state.activeNote = note;
        state.playId = state.playId + 1;
      }),

    setCurrentNoteIndex: index =>
      set((state) => {
        state.currentNoteIndex = index;
      }),

    startNoteSync: () => set({ isSyncing: true }),

    stopNoteSync: () => set({ isSyncing: false }),

    setNoteStartTime: time =>
      set((state) => {
        state.noteTimestamp.start = time;
      }),

    setNoteEndTime: time =>
      set((state) => {
        state.noteTimestamp.end = time;
      }),
  })),
);
