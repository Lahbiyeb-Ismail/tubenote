"use client";

import { useQuery } from "@tanstack/react-query";

import type { IPaginationQueryDto } from "@tubenote/dtos";

import { useAuthStore } from "@/features/auth/store";
import { getNotesByVideoId } from "../services";

export function useGetNotesByVideoId({
  videoId,
  paginationQuery,
}: { videoId: string; paginationQuery: IPaginationQueryDto }) {
  const { status } = useAuthStore();

  return useQuery({
    queryKey: ["video-notes", videoId, paginationQuery],
    queryFn: () => getNotesByVideoId(videoId, paginationQuery),
    enabled: status === "authenticated",
    select: (data) => ({
      notes: data.payload.data,
      paginationMeta: data.payload.paginationMeta,
    }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
