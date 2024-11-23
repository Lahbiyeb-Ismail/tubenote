"use client";

import { getRecentNotes } from "@/actions/note.actions";
import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "../global/useLocalStorage";

function useGetRecentNotes() {
	const [accessToken] = useLocalStorage("accessToken", null);

	return useQuery({
		queryKey: ["notes", "recentNotes"],
		queryFn: () => getRecentNotes(),
		enabled: !!accessToken,
	});
}

export default useGetRecentNotes;
