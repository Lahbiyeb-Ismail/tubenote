"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/contexts";

import type { IPaginationQueryDto } from "@tubenote/dtos";

import { getNotesByVideoId } from "../services";

export function useGetNotesByVideoId({
  videoId,
  paginationQuery,
}: { videoId: string; paginationQuery: IPaginationQueryDto }) {
  const { authState } = useAuth();

  return useQuery({
    queryKey: ["video-notes", videoId, paginationQuery],
    queryFn: () => getNotesByVideoId(videoId, paginationQuery),
    enabled: authState.isAuthenticated,
    select: (data) => ({
      notes: data.payload.data,
      paginationMeta: data.payload.paginationMeta,
    }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
