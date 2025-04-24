"use client";

import { useQuery } from "@tanstack/react-query";

import type { IPaginationQueryDto } from "@tubenote/dtos";

import { getStorageValue } from "@/utils";
import { getVideoNotes } from "../services";

export function useGetVideoNotes({
  videoId,
  paginationQuery,
}: { videoId: string; paginationQuery: IPaginationQueryDto }) {
  const isAuthenticated = getStorageValue<boolean>("isAuthenticated") ?? false;

  return useQuery({
    queryKey: ["videoNotes", videoId, paginationQuery],
    queryFn: () => getVideoNotes({ videoId, paginationQuery }),
    enabled: isAuthenticated,
  });
}
