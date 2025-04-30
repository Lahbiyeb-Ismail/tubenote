"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/contexts";

import { getCurrentUser } from "../services";

export function useGetCurrentUser() {
  const { authState } = useAuth();

  return useQuery({
    queryKey: ["current-user", authState.isAuthenticated],
    queryFn: getCurrentUser,
    // Enable the query only if the user is authenticated.
    enabled: authState.isAuthenticated,
    // The data is considered fresh for 5 minutes, after which it will be refetched.
    staleTime: 5 * 60 * 1000,
  });
}
