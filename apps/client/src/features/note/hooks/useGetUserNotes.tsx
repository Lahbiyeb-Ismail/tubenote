"use client";

import { useQuery } from "@tanstack/react-query";

import { getStorageValue } from "@/utils/localStorage";
import { getUserNotes } from "../services";

import type { IPaginationQueryDto } from "@tubenote/dtos";

export function useGetUserNotes(paginationQuery: IPaginationQueryDto) {
  const accessToken = getStorageValue<string>("accessToken");

  return useQuery({
    queryKey: ["notes", paginationQuery],
    queryFn: () => getUserNotes(paginationQuery),
    select: (data) => ({
      notes: data.payload.data,
      paginationMeta: data.payload.paginationMeta,
    }),
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
