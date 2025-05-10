"use client";

import { createContext, useContext, useReducer, useState } from "react";

import { useSaveVideoData } from "../hooks";
import { videoInitialState, videoReducer } from "../reducers";
import type { VideoContextType, VideoProviderProps } from "../types";

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: VideoProviderProps) {
  const [state, dispatch] = useReducer(videoReducer, videoInitialState);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);

  const saveVideoMutationResult = useSaveVideoData(dispatch);

  const value = {
    state,
    saveVideoMutationResult,
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
