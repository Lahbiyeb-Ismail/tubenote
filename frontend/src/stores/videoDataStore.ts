import type { VideoDataResponseType } from "@/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface VideoDataState {
  videoData: VideoDataResponseType | null;
  setVideoData: (data: VideoDataResponseType) => void;
}

const useVideoDataStore = create<VideoDataState>()(
  persist(
    (set) => ({
      videoData: null,
      setVideoData: (data) =>
        set(() => {
          return { videoData: data };
        }),
    }),
    {
      name: "videoData",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useVideoDataStore;
