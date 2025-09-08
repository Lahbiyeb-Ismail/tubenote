"use client";

import { useQuery } from "@tanstack/react-query";

import { getDashboardKeyMetrics } from "../api";

/**
 * React Query hook for fetching dashboard key metrics.
 * Returns totals for notes, videos, study time, and current streak with percentage changes.
 * Used for the key metrics cards on the dashboard.
 *
 * @returns {UseQueryResult} React Query result object containing:
 *   - data: Key metrics data with totals and percentage changes
 *   - isLoading: Loading state boolean
 *   - error: Error object if request fails
 *   - refetch: Function to manually refetch data
 */
export function useDashboardKeyMetricsQuery() {
  return useQuery({
    queryKey: ["dashboard-key-metrics"],
    queryFn: () => getDashboardKeyMetrics(),
    select: data => data.payload.data,
    // Cache key metrics for 3 minutes
    staleTime: 1000 * 60 * 3,
    refetchOnWindowFocus: false,
    retry: 2,
    throwOnError: true,
  });
}
