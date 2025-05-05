"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/contexts";

import type { IPaginationQueryDto } from "@tubenote/dtos";

import { getVideoNotes } from "../services";

export function useGetVideoNotes({
  videoId,
  paginationQuery,
}: { videoId: string; paginationQuery: IPaginationQueryDto }) {
  const { authState } = useAuth();

  return useQuery({
    queryKey: ["videoNotes", videoId, paginationQuery],
    queryFn: () => getVideoNotes({ videoId, paginationQuery }),
    enabled: authState.isAuthenticated,
  });
}
