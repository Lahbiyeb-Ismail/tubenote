"use client";

import type { IPaginationQueryDto } from "@tubenote/dtos";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/hooks";

import { getUserNotes } from "../services";

export function useGetUserNotesQuery(paginationQuery: IPaginationQueryDto) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["notes", paginationQuery],
    queryFn: () => getUserNotes(paginationQuery),
    select: data => ({
      notes: data.payload.data,
      paginationMeta: data.payload.paginationMeta,
    }),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
