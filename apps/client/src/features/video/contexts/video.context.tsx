"use client";

import { createContext, useContext, useReducer, useState } from "react";

import { useGetVideoData } from "../hooks";
import { videoInitialState, videoReducer } from "../reducers";
import type { VideoContextType, VideoProviderProps } from "../types";

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: VideoProviderProps) {
  const [state, dispatch] = useReducer(videoReducer, videoInitialState);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);

  const getVideoMutation = useGetVideoData(dispatch);

  const value = {
    state,
    saveVideo: getVideoMutation.mutate,
    isLoading: getVideoMutation.isPending,
    setVideoCurrentTime,
    videoCurrentTime,
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
