"use client";

import { useQuery } from "@tanstack/react-query";

import { getSecureCookie } from "@/utils/secureCookies";
import { getRecentlyUpdatedNotes } from "../services";

export function useGetRecentlyUpdatedNotes() {
  const accessToken = getSecureCookie("access_token");

  return useQuery({
    queryKey: ["notes", "recently_updated_notes"],
    queryFn: () => getRecentlyUpdatedNotes(),
    select: (data) => data.payload.data,
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
