"use client";

import { useNote } from "@/context/useNote";

import EditorPage from "@/components/editor/EditorPage";

function Editor() {
	const {
		state: { note },
	} = useNote();

	return (
		<EditorPage
			action="update"
			initialNoteContent={note?.content}
			noteTitle={note?.title}
			videoId={note?.youtubeId}
		/>
	);
}

export default Editor;
