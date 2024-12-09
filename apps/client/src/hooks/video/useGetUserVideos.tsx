"use client";

import { useQuery } from "@tanstack/react-query";

import { getUserVideos } from "@/actions/video.actions";
import { getStorageValue } from "@/utils/localStorage";

import { DEFAULT_PAGE, PAGE_LIMIT } from "@/utils/constants";

function useGetUserVideos({
  page = DEFAULT_PAGE,
  limit = PAGE_LIMIT,
}: { page?: number; limit?: number }) {
  const accessToken = getStorageValue<string>("accessToken");

  return useQuery({
    queryKey: ["videos", page, limit],
    queryFn: () => getUserVideos({ page, limit }),
    enabled: !!accessToken,
  });
}

export default useGetUserVideos;
