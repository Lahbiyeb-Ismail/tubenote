"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { getUserNotes } from "@/actions/note.actions";
import { getStorageValue } from "@/utils/localStorage";

import type { INote } from "@/types/note.types";
import type { Pagination } from "@/types";

import { PAGE_LIMIT, DEFAULT_PAGE } from "@/utils/constants";

function useGetUserNotes({
	page = DEFAULT_PAGE,
	limit = PAGE_LIMIT,
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
