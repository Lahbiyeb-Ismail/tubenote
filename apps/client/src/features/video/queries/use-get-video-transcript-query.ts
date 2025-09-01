"use client";

import { useQuery } from "@tanstack/react-query";

import { getVideoTranscript } from "../api";

/**
 * Hook to fetch video transcript data
 * @param videoId - The ID of the video to get transcript for
 * @param isExtracting - Whether transcript extraction is in progress
 * @returns Query result with transcript data
 */
export function useGetVideoTranscriptQuery(videoId: string, isExtracting: boolean) {
  return useQuery({
    queryKey: ["videoTranscript", videoId],
    queryFn: () => getVideoTranscript(videoId),
    select: response => ({
      transcript: response.payload.data.data.transcript,
    }),
    enabled: isExtracting,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
    throwOnError: true,
  });
}
