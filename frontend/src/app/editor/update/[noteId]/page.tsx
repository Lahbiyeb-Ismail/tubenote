"use client";

import EditorPage from "@/components/editor/EditorPage";
import useGetNoteById from "@/hooks/note/useGetNoteById";

function Editor({ params }: { params: { noteId: string } }) {
	const { noteId } = params;
	const { data, isLoading, isError } = useGetNoteById(noteId);

	if (isLoading || !data) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error...</div>;
	}

	return (
		<EditorPage
			action="update"
			initialNoteContent={data.content}
			noteTitle={data.title}
			noteId={data.id}
			videoId={data.youtubeId}
		/>
	);
}

export default Editor;
