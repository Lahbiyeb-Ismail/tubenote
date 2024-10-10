"use client";

import { useVideo } from "@/context/useVideo";
import parseStringtoHtml from "@/helpers/parseStringToHtml";
import React from "react";

function VideoPlayer() {
	const { state } = useVideo();

	const player = state.video?.player;

	const videoIframe = parseStringtoHtml(player?.embedHtml as string);

	console.log(player);
	return (
		<div
			// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
			dangerouslySetInnerHTML={{ __html: videoIframe }}
			className="mb-6 h-full"
		/>
	);
}

export default VideoPlayer;
