"use client";

import { getUserNotes } from "@/actions/note.actions";
import { useQuery } from "@tanstack/react-query";

function useGetUserNotes() {
	return useQuery({
		queryKey: ["notes"],
		queryFn: () => getUserNotes(),
	});
}

export default useGetUserNotes;
