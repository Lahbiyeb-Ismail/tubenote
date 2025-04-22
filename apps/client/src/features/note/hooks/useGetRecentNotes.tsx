"use client";

import { useQuery } from "@tanstack/react-query";

import { getSecureCookie } from "@/utils/secureCookies";
import { getRecentNotes } from "../services";

export function useGetRecentNotes() {
  const accessToken = getSecureCookie("access_token");

  return useQuery({
    queryKey: ["notes", "recent_notes"],
    queryFn: () => getRecentNotes(),
    select: (data) => data.payload.data,
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
