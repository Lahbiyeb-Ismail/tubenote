"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import type { User } from "@tubenote/db";

import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/features/auth/store";

import { getCurrentUser } from "../api";

export function useGetCurrentUserQuery(): UseQueryResult<User, Error> {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    select: response => response.payload.data,
    // Enable the query only if the user is authenticated.
    enabled: isAuthenticated,
    // The data is considered fresh for 5 minutes, after which it will be refetched.
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error instanceof Error && error.message.includes("not authorized")) {
        return false;
      }
      return failureCount < 2;
    },
  });
}
