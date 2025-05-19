"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/features/auth/store";

import { getRecentlyUpdatedNotes } from "../services";

export function useGetRecentlyUpdatedNotes() {
  const { status } = useAuthStore();

  return useQuery({
    queryKey: ["notes", "recently_updated_notes"],
    queryFn: () => getRecentlyUpdatedNotes(),
    select: (data) => data.payload.data,
    enabled: status === "authenticated",
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
