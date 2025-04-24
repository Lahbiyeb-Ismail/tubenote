"use client";

import { useQuery } from "@tanstack/react-query";

import type { IPaginationQueryDto } from "@tubenote/dtos";

import { getStorageValue } from "@/utils";
import { getUserNotes } from "../services";

export function useGetUserNotes(paginationQuery: IPaginationQueryDto) {
  const isAuthenticated = getStorageValue<boolean>("isAuthenticated") ?? false;

  return useQuery({
    queryKey: ["notes", paginationQuery],
    queryFn: () => getUserNotes(paginationQuery),
    select: (data) => ({
      notes: data.payload.data,
      paginationMeta: data.payload.paginationMeta,
    }),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
