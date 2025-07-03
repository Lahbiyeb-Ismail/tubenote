"use client";

import type { YouTubePlayer as YouTubePlayerType, YouTubeProps } from "react-youtube";

import { useEffect, useRef } from "react";
import YouTube from "react-youtube";

import { useVideoNoteStore } from "../store";

interface VideoPlayerProps {
  videoId?: string;
}

export function VideoPlayer({ videoId }: VideoPlayerProps) {
  const playerRef = useRef<YouTubePlayerType | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { activeNote, playId, isSyncing, setNoteEndTime, setNoteStartTime } = useVideoNoteStore();

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

  const onPlay: YouTubeProps["onPlay"] = () => {
    if (isSyncing) {
      const currentTime = playerRef.current?.getCurrentTime();
      if (currentTime) {
        setNoteStartTime(currentTime);
      }
    }
  };

  const onStateChange: YouTubeProps["onStateChange"] = (event) => {
    if (isSyncing) {
      // Continuously update the end time while the video is playing
      if (event.data === 1) { // Playing
        intervalRef.current = setInterval(() => {
          const currentTime = playerRef.current?.getCurrentTime();
          if (currentTime) {
            setNoteEndTime(currentTime);
          }
        }, 1000);
      }
      else { // Paused, ended, etc.
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    }
  };

  const opts: YouTubeProps["opts"] = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 0,
      iv_load_policy: 3, // Hide annotations
      rel: 0, // Don't show related videos
      showinfo: 0, // Hide video info
    },
  };

  return (
    <div className="h-full w-full">
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onPlayerReady}
        onPlay={onPlay}
        onStateChange={onStateChange}
        className="h-full w-full"
      />
    </div>
  );
}
