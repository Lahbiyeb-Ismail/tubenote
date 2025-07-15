"use client";

import type { ISearchAndPaginationQueryDto } from "@tubenote/dtos";

import { useQuery } from "@tanstack/react-query";

import { getUserVideos } from "../api";

export function useGetUserVideosQuery(searchQuery: ISearchAndPaginationQueryDto) {
  return useQuery({
    queryKey: ["videos", searchQuery],
    queryFn: () => getUserVideos(searchQuery),
    select: response => ({
      videos: response.payload.data,
      paginationMeta: response.payload.paginationMeta,
    }),
    // The data is considered fresh for 5 minutes, after which it will be refetched.
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: true,
  });
}
