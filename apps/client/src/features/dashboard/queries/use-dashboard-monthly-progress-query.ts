"use client";

import { useQuery } from "@tanstack/react-query";

import { getDashboardMonthlyProgress } from "../api";

/**
 * React Query hook for fetching dashboard monthly progress data.
 * Returns monthly progress breakdown for area charts and trend analysis.
 *
 * @param {number} months - Number of months to fetch (default: 6)
 * @returns {UseQueryResult} React Query result object containing:
 *   - data: Monthly progress data array
 *   - isLoading: Loading state boolean
 *   - error: Error object if request fails
 *   - refetch: Function to manually refetch data
 */
export function useDashboardMonthlyProgressQuery(months: number = 6) {
  return useQuery({
    queryKey: ["dashboard-monthly-progress", months],
    queryFn: () => getDashboardMonthlyProgress(months),
    select: data => data.payload.data,
    // Cache monthly progress for 10 minutes (changes less frequently)
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 2,
    throwOnError: true,
  });
}
