"use client";

import { useQuery } from "@tanstack/react-query";

import { getDashboardWeeklyActivity } from "../api";

/**
 * React Query hook for fetching dashboard weekly activity data.
 * Returns daily activity breakdown for charts and visualizations.
 *
 * @param {number} weeks - Number of weeks to fetch (default: 1)
 * @returns {UseQueryResult} React Query result object containing:
 *   - data: Weekly activity data array
 *   - isLoading: Loading state boolean
 *   - error: Error object if request fails
 *   - refetch: Function to manually refetch data
 */
export function useDashboardWeeklyActivityQuery(weeks: number = 1) {
  return useQuery({
    queryKey: ["dashboard-weekly-activity", weeks],
    queryFn: () => getDashboardWeeklyActivity(weeks),
    select: data => data.payload.data,
    // Cache weekly activity for 5 minutes
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 2,
    throwOnError: true,
  });
}
