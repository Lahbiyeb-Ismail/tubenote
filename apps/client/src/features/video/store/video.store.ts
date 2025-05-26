"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface VideoState {
  videoCurrentTime: number;
  isLoading: boolean;
  error: Error | null;
}

interface VideoStore extends VideoState {
  videoActions: {
    setVideoCurrentTime: (time: number) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: Error | null) => void;
  };
}

export const useVideoStore = create<VideoStore>()(
  immer((set) => ({
    videoCurrentTime: 0,
    isLoading: false,
    error: null,

    videoActions: {
      setVideoCurrentTime: (time) =>
        set((state) => {
          state.videoCurrentTime = time;
        }),

      setLoading: (isLoading) =>
        set((state) => {
          state.isLoading = isLoading;
        }),

      setError: (error) =>
        set((state) => {
          state.error = error;
        }),
    },
  }))
);
