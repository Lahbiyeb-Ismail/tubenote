"use client";

import { useQuery } from "@tanstack/react-query";

import { getVideoById } from "../services";

export function useGetVideoById(videoId: string) {
  return useQuery({
    queryKey: ["videos", videoId],
    queryFn: () => getVideoById(videoId),
    select: (response) => response.payload.data,
    enabled: !!videoId,
    // The data is considered fresh for 5 minutes, after which it will be refetched.
    staleTime: 5 * 60 * 1000,
  });
}
