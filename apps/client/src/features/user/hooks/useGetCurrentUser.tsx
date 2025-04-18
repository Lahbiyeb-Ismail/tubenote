"use client";

import { useQuery } from "@tanstack/react-query";

import { getStorageValue } from "@/utils/localStorage";
import { getCurrentUser } from "../services";

export function useGetCurrentUser() {
  const accessToken = getStorageValue<string>("accessToken");

  return useQuery({
    queryKey: ["current-user", accessToken],
    queryFn: getCurrentUser,
    // Enable the query only if the access token is available.
    enabled: !!accessToken,
    // The data is considered fresh for 5 minutes, after which it will be refetched.
    staleTime: 5 * 60 * 1000,
  });
}
