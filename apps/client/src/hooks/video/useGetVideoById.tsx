"use client";

import { useQuery } from "@tanstack/react-query";

import { getVideoById } from "@/actions/video.actions";

function useGetVideoById(videoId: string) {
  return useQuery({
    queryKey: ["videos", videoId],
    queryFn: () => getVideoById(videoId),
    enabled: !!videoId,
    // The data is considered fresh for 5 minutes, after which it will be refetched.
    staleTime: 5 * 60 * 1000,
  });
}

export default useGetVideoById;
