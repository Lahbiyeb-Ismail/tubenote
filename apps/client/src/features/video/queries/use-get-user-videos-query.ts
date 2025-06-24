"use client";

import type { IPaginationQueryDto } from "@tubenote/dtos";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/hooks";

import { getUserVideos } from "../services";

export function useGetUserVideosQuery(paginationQuery: IPaginationQueryDto) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["videos", paginationQuery],
    queryFn: () => getUserVideos(paginationQuery),
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
