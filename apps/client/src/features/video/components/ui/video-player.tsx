"use client";

import type { YouTubePlayer as YouTubePlayerType, YouTubeProps } from "react-youtube";

import { useEffect, useRef } from "react";
import YouTube from "react-youtube";

import { useVideoNoteStore } from "../../store";

interface VideoPlayerProps {
  videoId?: string;
}

export function VideoPlayer({ videoId }: VideoPlayerProps) {
  const playerRef = useRef<YouTubePlayerType | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { activeNote, playId } = useVideoNoteStore();

  useEffect(() => {
    if (activeNote && playerRef.current) {
      playerRef.current.seekTo(activeNote.timestamp.start);
      playerRef.current.playVideo();

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        const currentTime = playerRef.current?.getCurrentTime();
        if (currentTime && currentTime >= activeNote.timestamp.end) {
          playerRef.current?.pauseVideo();
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activeNote, playId]);

  const onPlayerReady: YouTubeProps["onReady"] = ({ target }) => {
    playerRef.current = target;
  };

  const opts: YouTubeProps["opts"] = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <div className="h-full w-full">
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onPlayerReady}
        className="h-full w-full"
      />
    </div>
  );
}
