"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/contexts";

import { getRecentlyUpdatedNotes } from "../services";

export function useGetRecentlyUpdatedNotes() {
  const { authState } = useAuth();

  return useQuery({
    queryKey: ["notes", "recently_updated_notes"],
    queryFn: () => getRecentlyUpdatedNotes(),
    select: (data) => data.payload.data,
    enabled: authState.isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
