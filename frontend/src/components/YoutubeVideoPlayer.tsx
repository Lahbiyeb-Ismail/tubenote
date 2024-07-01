/* eslint-disable react/no-danger */

"use client";

import React from "react";
import parseStringtoHtml from "@/helpers/parseStringtoHtml";
import useVideoDataStore from "@/stores/videoDataStore";

function YoutubeVideoPlayer() {
  const { videoData } = useVideoDataStore();

  const videoIframe = parseStringtoHtml(videoData?.videoPlayer as string);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: videoIframe }}
      className="mb-6 h-full"
    />
  );
}

export default YoutubeVideoPlayer;
