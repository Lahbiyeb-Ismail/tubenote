"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";

import { useVideoStore } from "@/stores/video-store";
import { useSaveVideoData } from "../hooks";
import { videoInitialState, videoReducer } from "../reducers";
import type { VideoContextType, VideoProviderProps } from "../types";

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: VideoProviderProps) {
  const [state, dispatch] = useReducer(videoReducer, videoInitialState);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);

  const saveVideoMutationResult = useSaveVideoData(dispatch);

  // Access the Zustand store actions
  const videoActions = useVideoStore((state) => state.actions);

  // Sync loading and error states with Zustand store
  useEffect(() => {
    videoActions.setLoading(saveVideoMutationResult.isPending);

    if (saveVideoMutationResult.error) {
      videoActions.setError(
        saveVideoMutationResult.error instanceof Error
          ? saveVideoMutationResult.error
          : new Error(String(saveVideoMutationResult.error))
      );
    } else {
      videoActions.setError(null);
    }
  }, [
    videoActions,
    saveVideoMutationResult.isPending,
    saveVideoMutationResult.error,
  ]);

  // Sync video data with Zustand store when it changes
  useEffect(() => {
    if (state.currentVideo) {
      videoActions.setCurrentVideo(state.currentVideo);
    }

    if (state.videos.length > 0) {
      videoActions.setVideos(state.videos);
    }
  }, [state.currentVideo, state.videos, videoActions]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      state,
      saveVideoMutationResult,
      setVideoCurrentTime,
      videoCurrentTime,
    }),
    [state, saveVideoMutationResult, videoCurrentTime]
  );

  return (
    <VideoContext.Provider value={value}>{children}</VideoContext.Provider>
  );
}

export function useVideo() {
  const context = useContext(VideoContext);

  if (context === undefined) {
    throw new Error("useVideo must be used within an VideoProvider");
  }

  return context;
}

// Create a simplified hook for components that only need to read video state
export function useVideoState() {
  const { videos, currentVideo, isLoading, error } = useVideoStore();

  return {
    videos,
    currentVideo,
    isLoading,
    error,
  };
}
