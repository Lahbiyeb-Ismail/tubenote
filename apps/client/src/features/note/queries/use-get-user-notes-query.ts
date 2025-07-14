"use client";

import type { ISearchAndPaginationQueryDto } from "@tubenote/dtos";

import { useQuery } from "@tanstack/react-query";

import { getUserNotes } from "../api";

export function useGetUserNotesQuery(queryOptions: ISearchAndPaginationQueryDto) {
  return useQuery({
    queryKey: ["notes", queryOptions],
    queryFn: () => getUserNotes(queryOptions),
    select: data => ({
      notes: data.payload.data,
      paginationMeta: data.payload.paginationMeta,
    }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
