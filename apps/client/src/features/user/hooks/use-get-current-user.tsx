"use client";

import { useQuery } from "@tanstack/react-query";

import { getStorageValue } from "@/utils";
import { getCurrentUser } from "../services";

export function useGetCurrentUser() {
  const isAuthenticated = getStorageValue<boolean>("isAuthenticated") ?? false;

  return useQuery({
    queryKey: ["current-user", isAuthenticated],
    queryFn: getCurrentUser,
    // Enable the query only if the user is authenticated.
    enabled: isAuthenticated,
    // The data is considered fresh for 5 minutes, after which it will be refetched.
    staleTime: 5 * 60 * 1000,
  });
}
