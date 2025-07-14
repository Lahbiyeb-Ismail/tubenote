"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { exchangeOauthCodeForAuthTokens } from "../api";

export function useOauthTokenExchangeMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: exchangeOauthCodeForAuthTokens,
    retry: false,
    onMutate: () => {
      // Cancel any outgoing refetches
      queryClient.cancelQueries({ queryKey: ["current-user"] });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });

      // Redirect to dashboard after successful login
      router.push("/dashboard");
    },
    onError: (error) => {
      console.log("Error exchanging OAuth token:", error);
    },
  });
}
