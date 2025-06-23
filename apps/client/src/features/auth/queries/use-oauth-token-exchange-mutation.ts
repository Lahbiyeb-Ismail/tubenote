"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { exchangeOauthCodeForAuthTokens } from "../services";
import { useAuthStore } from "../store";

export function useOauthTokenExchangeMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { setError, setAuthenticated } = useAuthStore();

  return useMutation({
    mutationFn: exchangeOauthCodeForAuthTokens,
    retry: false,
    onMutate: () => {
      // Cancel any outgoing refetches
      queryClient.cancelQueries({ queryKey: ["current-user"] });
    },
    onSuccess: async () => {
      // Set the authentication state
      setAuthenticated();

      queryClient.invalidateQueries({ queryKey: ["current-user"] });

      // Redirect to dashboard after successful login
      router.push("/dashboard");
    },
    onError: (error) => {
      setError(error.message);
    },
  });
}
