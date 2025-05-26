"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/features/auth/store";

import type { IPaginationQueryDto } from "@tubenote/dtos";

import { getUserVideos } from "../services";

export function useGetUserVideos(paginationQuery: IPaginationQueryDto) {
  const { status } = useAuthStore();

  return useQuery({
    queryKey: ["videos", paginationQuery],
    queryFn: () => getUserVideos(paginationQuery),
    select: (response) => response.payload,
    // The data is considered fresh for 5 minutes, after which it will be refetched.
    staleTime: 5 * 60 * 1000,
    // Only run the query if the access token is available
    enabled: status === "authenticated",
  });
}
