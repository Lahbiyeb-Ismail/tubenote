import { useState } from "react";

export function useToggleVideoPlayer(initialState = false) {
  const [isVideoPlayerVisible, setIsVideoPlayerVisible] =
    useState(initialState);

  const toggleVideoPlayer = () => setIsVideoPlayerVisible((prev) => !prev);

  return { isVideoPlayerVisible, toggleVideoPlayer };
}
