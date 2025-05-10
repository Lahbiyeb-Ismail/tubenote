"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/contexts";

import type { IPaginationQueryDto } from "@tubenote/dtos";

import { getUserNotes } from "../services";

export function useGetUserNotes(paginationQuery: IPaginationQueryDto) {
  const { authState } = useAuth();

  return useQuery({
    queryKey: ["notes", paginationQuery],
    queryFn: () => getUserNotes(paginationQuery),
    select: (data) => ({
      notes: data.payload.data,
      paginationMeta: data.payload.paginationMeta,
    }),
    enabled: authState.isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
