/* eslint-disable react/no-danger */

"use client";

import parseStringtoHtml from "@/helpers/parseStringtoHtml";
import useVideoDataStore from "@/stores/videoDataStore";
import React from "react";

function YoutubeVideoPlayer() {
  const videoData = useVideoDataStore((state) => state.videoData);

  const videoIframe = parseStringtoHtml(videoData?.videoPlayer as string);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: videoIframe }}
      className="mb-6 h-full"
    />
  );
}

export default YoutubeVideoPlayer;
