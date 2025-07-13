"use client";

import { useQuery } from "@tanstack/react-query";

import { getUserVideosCount } from "../api";

export function useGetUserVideosCountQuery() {
  return useQuery({
    queryKey: ["videos-count"],
    queryFn: () => getUserVideosCount(),
    select: response => response.payload.data,
    // The data is considered fresh for 5 minutes, after which it will be refetched.
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
