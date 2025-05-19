"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/features/auth/store";

import type { IPaginationQueryDto } from "@tubenote/dtos";

import { getUserNotes } from "../services";

export function useGetUserNotes(paginationQuery: IPaginationQueryDto) {
  const { status } = useAuthStore();

  return useQuery({
    queryKey: ["notes", paginationQuery],
    queryFn: () => getUserNotes(paginationQuery),
    select: (data) => ({
      notes: data.payload.data,
      paginationMeta: data.payload.paginationMeta,
    }),
    enabled: status === "authenticated",
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
