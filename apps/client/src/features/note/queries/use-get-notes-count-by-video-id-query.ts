"use client";

import { useQuery } from "@tanstack/react-query";

import { getNotesCountByVideoId } from "../api";

export function useGetNotesCountByVideoIdQuery(ytVideoId: string) {
  return useQuery({
    queryKey: ["video-notes-count", ytVideoId],
    queryFn: () => getNotesCountByVideoId(ytVideoId),
    select: response => ({
      count: response.payload.data,
      message: response.payload.message,
    }),
    enabled: !!ytVideoId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    throwOnError: true,
  });
}
