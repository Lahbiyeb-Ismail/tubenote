"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import type { User } from "@tubenote/db";

import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "../api";

export function useGetCurrentUserQuery(): UseQueryResult<User, Error> {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    select: response => response.payload.data,
    retry: (failureCount, error) => {
      // Retry up to 3 times only for 500 status codes
      if (error && "status" in error && error.status === 500) {
        return failureCount < 3;
      }
      return false;
    },
    refetchOnWindowFocus: false, // Do not refetch when the window gains focus
    staleTime: 5 * 60 * 1000, // 5 minutes stale time
  });
}
