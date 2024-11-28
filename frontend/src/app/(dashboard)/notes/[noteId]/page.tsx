"use client";

import useGetNoteById from "@/hooks/note/useGetNoteById";

type NotePageParams = {
	noteId: string;
};

function NotePage({ params }: { params: NotePageParams }) {
	const { noteId } = params;
	const { data, isLoading, isError } = useGetNoteById(noteId);

	if (isLoading) return <div>Loading...</div>;

	if (isError) return <div>Error</div>;

	return <div>{data?.title}</div>;
}

export default NotePage;
