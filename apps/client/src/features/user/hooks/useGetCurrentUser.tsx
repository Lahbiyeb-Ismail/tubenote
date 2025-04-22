"use client";

import { useQuery } from "@tanstack/react-query";

import { getSecureCookie } from "@/utils/secureCookies";
import { getCurrentUser } from "../services";

export function useGetCurrentUser() {
  const accessToken = getSecureCookie("access_token");

  return useQuery({
    queryKey: ["current-user", accessToken],
    queryFn: getCurrentUser,
    // Enable the query only if the user is authenticated.
    enabled: accessToken !== undefined,
    // The data is considered fresh for 5 minutes, after which it will be refetched.
    staleTime: 5 * 60 * 1000,
  });
}
