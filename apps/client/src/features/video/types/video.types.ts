import type { ReactNode } from "react";

import type { Video } from "@tubenote/types";

export type VideoProviderProps = {
  children: ReactNode;
};

export type VideoState = {
  video: Video | null;
  message: string | null;
  success: boolean;
};

export type VideoContextType = {
  state: VideoState;
  saveVideo: (videoUrl: string) => void;
  isLoading: boolean;
  videoCurrentTime: number;
  setVideoCurrentTime: (time: number) => void;
};

export type VideoAction =
  | {
      type: "SAVE_VIDEO_SUCCESS";
      payload: { message: string; video: Video; success: true };
    }
  | { type: "SAVE_VIDEO_FAIL"; payload: { message: string; success: false } };
