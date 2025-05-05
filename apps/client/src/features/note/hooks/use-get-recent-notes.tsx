"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/contexts";

import { getRecentNotes } from "../services";

export function useGetRecentNotes() {
  const { authState } = useAuth();

  return useQuery({
    queryKey: ["notes", "recent_notes"],
    queryFn: () => getRecentNotes(),
    select: (data) => data.payload.data,
    enabled: authState.isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
