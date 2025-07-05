"use client";

import type { IPaginationQueryDto } from "@tubenote/dtos";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/hooks";

import { getNotesByVideoId } from "../api";

export function useGetNotesByVideoIdQuery({
  videoId,
  paginationQuery,
}: { videoId: string; paginationQuery: IPaginationQueryDto }) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["video-notes", videoId, paginationQuery],
    queryFn: () => getNotesByVideoId(videoId, paginationQuery),
    enabled: isAuthenticated && !!videoId,
    select: data => ({
      notes: data.payload.data,
      paginationMeta: data.payload.paginationMeta,
    }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
