"use client";

import { createContext, useContext, useReducer, useState } from "react";

import type { VideoContextType, VideoProviderProps } from "@/types/video.types";

import useSaveVideoData from "@/hooks/video/useSaveVideoData";
import videoReducer, { videoInitialState } from "@/reducers/video.reducer";

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: VideoProviderProps) {
  const [state, dispatch] = useReducer(videoReducer, videoInitialState);
  const [noteTimestamp, setNoteTimestamp] = useState({ start: 0, end: 0 });

  const saveVideoMutation = useSaveVideoData(dispatch);

  const value = {
    state,
    saveVideo: saveVideoMutation.mutate,
    isLoading: saveVideoMutation.isPending,
    setNoteTimestamp,
    noteTimestamp,
  };

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
