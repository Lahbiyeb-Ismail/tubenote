"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { getUserNotes, type Pagination } from "@/actions/note.actions";
import { getStorageValue } from "@/utils/localStorage";
import type { INote } from "@/types/note.types";

function useGetUserNotes({
	page = 1,
	limit = 8,
}: { page: number; limit: number }): UseQueryResult<{
	notes: INote[];
	pagination: Pagination;
}> {
	const accessToken = getStorageValue<string>("accessToken");

	return useQuery({
		queryKey: ["notes", page, limit],
		queryFn: () => getUserNotes({ page, limit }),
		enabled: !!accessToken,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
}

export default useGetUserNotes;
