"use client";

import React from "react";
import YouTube from "react-youtube";

import { useVideo } from "@/context/useVideo";

function VideoPlayer() {
	const { state } = useVideo();

	const videoId = state.video?.youtubeId;

	return (
		<div className="h-full">
			<YouTube
				videoId={videoId}
				style={{ height: "100%" }}
				opts={{ width: "100%", height: "100%" }}
			/>
		</div>
	);
}

export default VideoPlayer;
