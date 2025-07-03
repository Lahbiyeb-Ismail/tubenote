"use client";

import type { ISearchAndPaginationQueryDto } from "@tubenote/dtos";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/hooks";

import { getUserNotes } from "../services";

export function useGetUserNotesQuery(queryOptions: ISearchAndPaginationQueryDto) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["notes", queryOptions],
    queryFn: () => getUserNotes(queryOptions),
    select: data => ({
      notes: data.payload.data,
      paginationMeta: data.payload.paginationMeta,
    }),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
