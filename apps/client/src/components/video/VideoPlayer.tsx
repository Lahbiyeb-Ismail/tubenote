"use client";

import { useVideo } from "@/context/useVideo";
import { useNote } from "@/features/note/contexts";
import { useRef } from "react";
import YouTube, { type YouTubeProps } from "react-youtube";

type VideoPlayerProps = {
  videoId?: string;
};

function VideoPlayer({ videoId }: VideoPlayerProps) {
  const playerRef = useRef<any | null>(null);
  const { setVideoCurrentTime } = useVideo();
  const {
    state: { note },
  } = useNote();

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    playerRef.current = event.target;

    if (playerRef.current && note) {
      playerRef.current.seekTo(note.timestamp);
    }
  };

  const onStateChange: YouTubeProps["onStateChange"] = (event) => {
    // Check if the player is playing (state 1)
    if (event.data === 1) {
      const time = playerRef.current?.getCurrentTime() || 0;
      setVideoCurrentTime(time);
    }
  };

  const onPause: YouTubeProps["onPause"] = () => {
    const time = playerRef.current?.getCurrentTime() || 0;
    setVideoCurrentTime(time);
  };

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  return (
    <div className="h-full">
      <YouTube
        videoId={videoId}
        style={{ height: "100%" }}
        opts={opts}
        onReady={onPlayerReady}
        onStateChange={onStateChange}
        onPause={onPause}
      />
    </div>
  );
}

export default VideoPlayer;
