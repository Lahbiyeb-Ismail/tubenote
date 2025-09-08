"use client";

import { useQuery } from "@tanstack/react-query";

import { getDashboardData } from "../api";

/**
 * React Query hook for fetching complete dashboard data.
 * This hook provides optimized data fetching for all dashboard components
 * in a single API call to improve performance.
 *
 * @returns {UseQueryResult} React Query result object containing:
 *   - data: Complete dashboard data including metrics, activities, charts, etc.
 *   - isLoading: Loading state boolean
 *   - error: Error object if request fails
 *   - refetch: Function to manually refetch data
 */
export function useDashboardDataQuery() {
  return useQuery({
    queryKey: ["dashboard-data"],
    queryFn: () => getDashboardData(),
    select: data => data.payload.data,
    // Cache data for 2 minutes for dashboard overview
    staleTime: 1000 * 60 * 2,
    // Don't refetch on window focus for dashboard data
    refetchOnWindowFocus: false,
    // Retry failed requests up to 2 times
    retry: 2,
    // Throw errors to be handled by error boundaries
    throwOnError: true,
  });
}
