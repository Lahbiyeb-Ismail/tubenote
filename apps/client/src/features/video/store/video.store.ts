"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface VideoState {
  isLoading: boolean;
  error: Error | null;
}

interface VideoStore extends VideoState {
  videoActions: {
    setLoading: (isLoading: boolean) => void;
    setError: (error: Error | null) => void;
  };
}

export const useVideoStore = create<VideoStore>()(
  immer((set) => ({
    isLoading: false,
    error: null,

    videoActions: {
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
