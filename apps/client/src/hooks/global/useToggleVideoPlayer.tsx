import { useState } from "react";

function useToggleVideoPlayer(initialState = false) {
  const [isVideoPlayerVisible, setIsVideoPlayerVisible] =
    useState(initialState);

  const toggleVideoPlayer = () => setIsVideoPlayerVisible((prev) => !prev);

  return { isVideoPlayerVisible, toggleVideoPlayer };
}

export default useToggleVideoPlayer;
