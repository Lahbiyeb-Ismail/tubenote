"use client";

import { getRecentlyUpdatedNotes } from "@/actions/note.actions";
import { useAuth } from "@/context/useAuth";
import { useQuery } from "@tanstack/react-query";

function useGetRecentlyUpdatedNotes() {
	const {
		state: { accessToken },
	} = useAuth();

	return useQuery({
		queryKey: ["recentlyUpdatedNotes"],
		queryFn: () => getRecentlyUpdatedNotes(),
		enabled: !!accessToken,
	});
}

export default useGetRecentlyUpdatedNotes;
