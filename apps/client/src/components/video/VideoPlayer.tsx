"use client";

import React, { useEffect, useRef } from "react";
import YouTube, { type YouTubeProps } from "react-youtube";

import { useVideo } from "@/context/useVideo";
import type { Timestamp } from "@/types/note.types";

type VideoPlayerProps = {
  videoId: string;
  timestamp?: Timestamp;
};

function VideoPlayer({ videoId, timestamp }: VideoPlayerProps) {
  const playerRef = useRef<any | null>(null);

  const { setNoteTimestamp, noteTimestamp } = useVideo();

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    playerRef.current = event.target;

    if (playerRef.current && timestamp) {
      syncVideoWithNote(timestamp.start);
      playerRef.current.playVideo();
    }
  };

  const onPlay: YouTubeProps["onPlay"] = () => {
    setNoteTimestamp({
      ...noteTimestamp,
      start:
        noteTimestamp.end - noteTimestamp.start < 0
          ? 0
          : Math.floor(noteTimestamp.end - noteTimestamp.start),
    });
  };

  const onPause: YouTubeProps["onPause"] = () => {
    setNoteTimestamp({
      ...noteTimestamp,
      end: Math.floor(playerRef.current?.getCurrentTime()) || 0,
    });
  };

  const syncVideoWithNote = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (timestamp) {
      syncVideoWithNote(timestamp.start);
    }
  }, [timestamp]);

  useEffect(() => {
    const checkTime = () => {
      if (playerRef.current && timestamp) {
        const currentTime = playerRef.current.getCurrentTime();
        if (currentTime >= timestamp.end) {
          playerRef.current.pauseVideo();
        }
      }
    };

    const interval = setInterval(checkTime, 1000); // Check every second

    return () => clearInterval(interval);
  }, [timestamp]);

  const opts = {
    height: "100%",
    width: "100%",
  };

  return (
    <div className="h-full">
      <YouTube
        videoId={videoId}
        style={{ height: "100%" }}
        opts={opts}
        onReady={onPlayerReady}
        onPause={onPause}
        onPlay={onPlay}
      />
    </div>
  );
}

export default VideoPlayer;
