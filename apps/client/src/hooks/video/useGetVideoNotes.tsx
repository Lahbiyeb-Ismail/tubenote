"use client";

import { useQuery } from "@tanstack/react-query";

import { getVideoNotes } from "@/actions/video.actions";
import { getStorageValue } from "@/utils/localStorage";

import { DEFAULT_PAGE, PAGE_LIMIT } from "@/utils/constants";

function useGetVideoNotes({
  videoId,
  page = DEFAULT_PAGE,
  limit = PAGE_LIMIT,
}: { videoId: string; page?: number; limit?: number }) {
  const accessToken = getStorageValue<string>("accessToken");

  return useQuery({
    queryKey: ["videoNotes", page, limit],
    queryFn: () => getVideoNotes({ videoId, page, limit }),
    enabled: !!accessToken,
  });
}

export default useGetVideoNotes;
