"use client";

import { Video } from "@tubenote/types";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface VideoState {
  videos: Video[];
  currentVideo: Video | null;
  isLoading: boolean;
  error: Error | null;
}

interface VideoStore extends VideoState {
  actions: {
    setVideos: (videos: Video[]) => void;
    setCurrentVideo: (video: Video | null) => void;
    addVideo: (video: Video) => void;
    updateVideo: (id: string, updates: Partial<Video>) => void;
    removeVideo: (id: string) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: Error | null) => void;
  };
}

export const useVideoStore = create<VideoStore>()(
  immer((set) => ({
    videos: [],
    currentVideo: null,
    isLoading: false,
    error: null,

    actions: {
      setVideos: (videos) =>
        set((state) => {
          state.videos = videos;
        }),

      setCurrentVideo: (video) =>
        set((state) => {
          state.currentVideo = video;
        }),

      addVideo: (video) =>
        set((state) => {
          state.videos.push(video);
        }),

      updateVideo: (id, updates) =>
        set((state) => {
          const index = state.videos.findIndex((video) => video.id === id);
          if (index !== -1) {
            state.videos[index] = { ...state.videos[index], ...updates };

            // If this is the current video, update it too
            if (state.currentVideo?.id === id) {
              state.currentVideo = { ...state.currentVideo, ...updates };
            }
          }
        }),

      removeVideo: (id) =>
        set((state) => {
          state.videos = state.videos.filter((video) => video.id !== id);
          if (state.currentVideo?.id === id) {
            state.currentVideo = null;
          }
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
