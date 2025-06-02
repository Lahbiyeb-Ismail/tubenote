"use client";

import { useState } from "react";
import YouTube, { type YouTubeProps } from "react-youtube";

import { useNoteStore } from "@/features/note/store";

type VideoPlayerProps = {
  videoId?: string;
};

export function VideoPlayer({ videoId }: VideoPlayerProps) {
  const [startTime, setStartTime] = useState<number>(0);

  const {
    note,
    noteActions: { setNoteTimestamp },
  } = useNoteStore();

  const onPlayerReady: YouTubeProps["onReady"] = ({ target }) => {
    if (note) {
      target.seekTo(note.timestamp.start);
    }
  };

  const onPlay: YouTubeProps["onPlay"] = ({ target }) => {
    const time = target.getCurrentTime();

    setStartTime(time);
  };

  const onPause: YouTubeProps["onPause"] = ({ target }) => {
    const time = target.getCurrentTime();

    setNoteTimestamp({
      start: startTime,
      end: time,
    });
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
        onPause={onPause}
        onPlay={onPlay}
      />
    </div>
  );
}
