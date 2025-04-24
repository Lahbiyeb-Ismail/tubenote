"use client";

import { useQuery } from "@tanstack/react-query";

import { getStorageValue } from "@/utils";
import { getRecentNotes } from "../services";

export function useGetRecentNotes() {
  const isAuthenticated = getStorageValue<boolean>("isAuthenticated") ?? false;

  return useQuery({
    queryKey: ["notes", "recent_notes"],
    queryFn: () => getRecentNotes(),
    select: (data) => data.payload.data,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
