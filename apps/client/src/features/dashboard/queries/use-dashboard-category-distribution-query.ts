"use client";

import { useQuery } from "@tanstack/react-query";

import { getDashboardCategoryDistribution } from "../api";

/**
 * React Query hook for fetching dashboard category distribution data.
 * Returns how user notes are distributed across different categories for pie charts.
 *
 * @returns {UseQueryResult} React Query result object containing:
 *   - data: Category distribution data array
 *   - isLoading: Loading state boolean
 *   - error: Error object if request fails
 *   - refetch: Function to manually refetch data
 */
export function useDashboardCategoryDistributionQuery() {
  return useQuery({
    queryKey: ["dashboard-category-distribution"],
    queryFn: () => getDashboardCategoryDistribution(),
    select: data => data.payload.data,
    // Cache category distribution for 15 minutes (changes infrequently)
    staleTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
    retry: 2,
    throwOnError: true,
  });
}
