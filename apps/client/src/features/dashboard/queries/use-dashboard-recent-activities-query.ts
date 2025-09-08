"use client";

import { useQuery } from "@tanstack/react-query";

import { getDashboardRecentActivities } from "../api";

/**
 * React Query hook for fetching dashboard recent activities data.
 * Returns the most recent user activities for the activity feed.
 *
 * @param {number} limit - Maximum number of activities to return (default: 10)
 * @returns {UseQueryResult} React Query result object containing:
 *   - data: Recent activities data array
 *   - isLoading: Loading state boolean
 *   - error: Error object if request fails
 *   - refetch: Function to manually refetch data
 */
export function useDashboardRecentActivitiesQuery(limit: number = 10) {
  return useQuery({
    queryKey: ["dashboard-recent-activities", limit],
    queryFn: () => getDashboardRecentActivities(limit),
    select: data => data.payload.data,
    // Cache recent activities for 1 minute (most frequently changing)
    staleTime: 1000 * 60 * 1,
    refetchOnWindowFocus: false,
    retry: 2,
    throwOnError: true,
  });
}
