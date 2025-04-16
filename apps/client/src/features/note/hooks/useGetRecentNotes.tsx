"use client";

import { useQuery } from "@tanstack/react-query";

import { getStorageValue } from "@/utils/localStorage";
import { getRecentNotes } from "../services";

export function useGetRecentNotes() {
  const accessToken = getStorageValue<string>("accessToken");

  return useQuery({
    queryKey: ["notes", "recent_notes"],
    queryFn: () => getRecentNotes(),
    select: (data) => data.payload.data,
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
