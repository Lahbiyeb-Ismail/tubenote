"use client";

import { useQuery } from "@tanstack/react-query";

import type { IPaginationQueryDto } from "@tubenote/dtos";

import { getSecureCookie } from "@/utils/secureCookies";
import { getVideoNotes } from "../services";

export function useGetVideoNotes({
  videoId,
  paginationQuery,
}: { videoId: string; paginationQuery: IPaginationQueryDto }) {
  const accessToken = getSecureCookie("access_token");

  return useQuery({
    queryKey: ["videoNotes", videoId, paginationQuery],
    queryFn: () => getVideoNotes({ videoId, paginationQuery }),
    enabled: !!accessToken,
  });
}
