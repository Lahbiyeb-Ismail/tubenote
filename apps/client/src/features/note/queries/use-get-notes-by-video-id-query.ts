"use client";

import type { IPaginationQueryDto } from "@tubenote/dtos";

import { useQuery } from "@tanstack/react-query";

import { getNotesByVideoId } from "../api";

export function useGetNotesByVideoIdQuery({
  videoId,
  paginationQuery,
}: { videoId: string; paginationQuery: IPaginationQueryDto }) {
  return useQuery({
    queryKey: ["video-notes", videoId, paginationQuery],
    queryFn: () => getNotesByVideoId(videoId, paginationQuery),
    enabled: !!videoId,
    select: data => ({
      notes: data.payload.data,
      paginationMeta: data.payload.paginationMeta,
    }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
