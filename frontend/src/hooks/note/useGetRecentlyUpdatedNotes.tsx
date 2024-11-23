"use client";

import { useQuery } from "@tanstack/react-query";

import { getRecentlyUpdatedNotes } from "@/actions/note.actions";
import { useLocalStorage } from "../global/useLocalStorage";

function useGetRecentlyUpdatedNotes() {
	const [accessToken] = useLocalStorage("accessToken", null);

	return useQuery({
		queryKey: ["notes", "recentlyUpdatedNotes"],
		queryFn: () => getRecentlyUpdatedNotes(),
		enabled: !!accessToken,
	});
}

export default useGetRecentlyUpdatedNotes;
