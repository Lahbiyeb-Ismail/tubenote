"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/features/auth/store";

import { getRecentNotes } from "../services";

export function useGetRecentNotes() {
  const { status } = useAuthStore();

  return useQuery({
    queryKey: ["notes", "recent_notes"],
    queryFn: () => getRecentNotes(),
    select: (data) => data.payload.data,
    enabled: status === "authenticated",
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
