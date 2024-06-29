import type { VideoDataResponseType } from "@/types";
import { create } from "zustand";

interface VideoDataState {
  videoData: VideoDataResponseType | null;
  setVideoData: (data: VideoDataResponseType) => void;
}

const getInitialVideoData = () =>
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("videoData") || "{}")
    : ({} as VideoDataResponseType);

const useVideoDataStore = create<VideoDataState>((set) => ({
  videoData: getInitialVideoData(),
  setVideoData: (data) =>
    set(() => {
      localStorage.setItem("videoData", JSON.stringify(data));
      return { videoData: data };
    }),
}));

export default useVideoDataStore;
