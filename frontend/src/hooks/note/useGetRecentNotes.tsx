"use client";

import { useQuery } from "@tanstack/react-query";

import { getRecentNotes } from "@/actions/note.actions";
import { getStorageValue } from "@/utils/localStorage";

function useGetRecentNotes() {
	const accessToken = getStorageValue<string>("accessToken");

	return useQuery({
		queryKey: ["notes", "recentNotes"],
		queryFn: () => getRecentNotes(),
		enabled: !!accessToken,
	});
}

export default useGetRecentNotes;
