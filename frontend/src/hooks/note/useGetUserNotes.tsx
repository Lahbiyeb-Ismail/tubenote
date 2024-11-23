"use client";

import { useQuery } from "@tanstack/react-query";

import { getUserNotes } from "@/actions/note.actions";
import { useLocalStorage } from "../global/useLocalStorage";

function useGetUserNotes() {
	const [accessToken] = useLocalStorage("accessToken", null);

	return useQuery({
		queryKey: ["notes"],
		queryFn: () => getUserNotes(),
		enabled: !!accessToken,
	});
}

export default useGetUserNotes;
