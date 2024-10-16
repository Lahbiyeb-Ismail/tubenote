"use client";

import { getRecentNotes } from "@/actions/note.actions";
import { useAuth } from "@/context/useAuth";
import { useQuery } from "@tanstack/react-query";

function useGetRecentNotes() {
	const {
		state: { accessToken },
	} = useAuth();

	return useQuery({
		queryKey: ["notes"],
		queryFn: () => getRecentNotes(),
		enabled: !!accessToken,
	});
}

export default useGetRecentNotes;
