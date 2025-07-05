"use client";

import type { ISearchAndPaginationQueryDto } from "@tubenote/dtos";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/hooks";

import { getUserVideos } from "../api";

export function useGetUserVideosQuery(searchQuery: ISearchAndPaginationQueryDto) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["videos", searchQuery],
    queryFn: () => getUserVideos(searchQuery),
    select: response => ({
      videos: response.payload.data,
      paginationMeta: response.payload.paginationMeta,
    }),
    // The data is considered fresh for 5 minutes, after which it will be refetched.
    staleTime: 5 * 60 * 1000,
    // Only run the query if user is authenticated
    enabled: isAuthenticated,
  });
}
