"use client";

import { useQuery } from "@tanstack/react-query";

import { getUserNotes } from "@/actions/note.actions";
import { getStorageValue } from "@/utils/localStorage";

function useGetUserNotes() {
	const accessToken = getStorageValue<string>("accessToken");

	return useQuery({
		queryKey: ["notes"],
		queryFn: () => getUserNotes(),
		enabled: !!accessToken,
	});
}

export default useGetUserNotes;
