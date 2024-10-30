"use client";

import { useVideo } from "@/context/useVideo";

import EditorPage from "@/components/editor/EditorPage";

function Editor() {
	const {
		state: { video },
	} = useVideo();

	return <EditorPage videoId={video?.youtubeId} />;
}

export default Editor;
