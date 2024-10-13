"use client";

import React from "react";
import YouTube from "react-youtube";

type VideoPlayerProps = {
	videoId?: string;
};

function VideoPlayer({ videoId }: VideoPlayerProps) {
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
