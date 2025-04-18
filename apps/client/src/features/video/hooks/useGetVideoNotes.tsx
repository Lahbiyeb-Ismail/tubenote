"use client";

import { useQuery } from "@tanstack/react-query";

import { getStorageValue } from "@/utils/localStorage";
import { getVideoNotes } from "../services";

import type { IPaginationQueryDto } from "@tubenote/dtos";

export function useGetVideoNotes({
  videoId,
  paginationQuery,
}: { videoId: string; paginationQuery: IPaginationQueryDto }) {
  const accessToken = getStorageValue<string>("accessToken");

  return useQuery({
    queryKey: ["videoNotes", videoId, paginationQuery],
    queryFn: () => getVideoNotes({ videoId, paginationQuery }),
    enabled: !!accessToken,
  });
}
