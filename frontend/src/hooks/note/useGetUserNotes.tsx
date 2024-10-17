"use client";

import { getUserNotes } from "@/actions/note.actions";
import { useAuth } from "@/context/useAuth";
import { useQuery } from "@tanstack/react-query";

function useGetUserNotes() {
	const {
		state: { accessToken },
	} = useAuth();

	return useQuery({
		queryKey: ["notes"],
		queryFn: () => getUserNotes(),
		enabled: !!accessToken,
	});
}

export default useGetUserNotes;
