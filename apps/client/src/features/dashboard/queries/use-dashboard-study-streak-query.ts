"use client";

import { useQuery } from "@tanstack/react-query";

import { getDashboardStudyStreak } from "../api";

/**
 * React Query hook for fetching dashboard study streak data.
 * Returns current streak, longest streak, and streak visualization data.
 *
 * @returns {UseQueryResult} React Query result object containing:
 *   - data: Study streak data with current/longest streak and visualization array
 *   - isLoading: Loading state boolean
 *   - error: Error object if request fails
 *   - refetch: Function to manually refetch data
 */
export function useDashboardStudyStreakQuery() {
  return useQuery({
    queryKey: ["dashboard-study-streak"],
    queryFn: () => getDashboardStudyStreak(),
    select: data => data.payload.data,
    // Cache study streak for 5 minutes
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 2,
    throwOnError: true,
  });
}
