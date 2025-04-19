"use client";

import { useQuery } from "@tanstack/react-query";

import type { IPaginationQueryDto } from "@tubenote/dtos";

import { getSecureCookie } from "@/utils/secureCookies";
import { getUserNotes } from "../services";

export function useGetUserNotes(paginationQuery: IPaginationQueryDto) {
  const accessToken = getSecureCookie("access_token");

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
