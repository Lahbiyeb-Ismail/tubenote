"use client";

import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import type { User } from "@tubenote/types";

import { getCurrentUser } from "../services";

export function useGetCurrentUser(
  isAuthenticated: boolean
): UseQueryResult<User, Error> {
  return useQuery({
    queryKey: ["current-user", isAuthenticated],
    queryFn: getCurrentUser,
    select: (response) => response.payload.data,
    // Enable the query only if the user is authenticated.
    enabled: isAuthenticated,
    // The data is considered fresh for 5 minutes, after which it will be refetched.
    staleTime: 5 * 60 * 1000,
  });
}
