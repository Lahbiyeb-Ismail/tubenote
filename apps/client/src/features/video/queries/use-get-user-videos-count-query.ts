"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/hooks";

import { getUserVideosCount } from "../services";

export function useGetUserVideosCountQuery() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["videos-count"],
    queryFn: () => getUserVideosCount(),
    select: response => response.payload.data,
    // The data is considered fresh for 5 minutes, after which it will be refetched.
    staleTime: 5 * 60 * 1000,
    // Only run the query if the access token is available
    enabled: isAuthenticated,
  });
}
