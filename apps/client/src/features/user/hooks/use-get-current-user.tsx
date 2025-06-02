"use client";

import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import type { User } from "@tubenote/db";

import { useAuthStore } from "@/features/auth/store";
import { getCurrentUser } from "../services";

export function useGetCurrentUser(): UseQueryResult<User, Error> {
  const { status } = useAuthStore();

  const isAuthenticated = status === "authenticated";

  return useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    select: (response) => response.payload.data,
    // Enable the query only if the user is authenticated.
    enabled: isAuthenticated,
    // The data is considered fresh for 5 minutes, after which it will be refetched.
    staleTime: 5 * 60 * 1000,
  });
}
