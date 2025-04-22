"use client";

import { useQuery } from "@tanstack/react-query";

import { getStorageValue } from "@/utils/localStorage";
import { getRecentlyUpdatedNotes } from "../services";

export function useGetRecentlyUpdatedNotes() {
  const isAuthenticated = getStorageValue<boolean>("isAuthenticated") ?? false;

  return useQuery({
    queryKey: ["notes", "recently_updated_notes"],
    queryFn: () => getRecentlyUpdatedNotes(),
    select: (data) => data.payload.data,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
