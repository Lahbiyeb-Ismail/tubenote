"use client";

import { useQuery } from "@tanstack/react-query";

import { getNoteById } from "@/actions/note.actions";

function useGetNoteById(noteId: string) {
	return useQuery({
		queryKey: ["note", noteId],
		queryFn: () => getNoteById(noteId),
		enabled: !!noteId,
	});
}

export default useGetNoteById;
