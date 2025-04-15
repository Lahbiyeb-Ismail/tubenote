"use client";

import { verifyPasswordResetToken } from "@/actions/password.actions";
import { useQuery } from "@tanstack/react-query";

export function useVerifyPasswordResetToken(token: string) {
  return useQuery({
    queryKey: ["reset-token", token],
    queryFn: () => verifyPasswordResetToken(token),
    // Enable the query only if the token is available.
    enabled: !!token,
    // Prevent refetching by setting a very long stale time
    staleTime: Number.POSITIVE_INFINITY,
    // Disable automatic refetching
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    // Don't retry on failure
    retry: false,
  });
}
