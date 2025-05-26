"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { setStorageValue } from "@/utils";

import { exchangeOauthCodeForAuthTokens } from "../services";
import { useAuthStore } from "../store";

export function useExchangeOauthCode() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { authActions } = useAuthStore();

  const { setError, setLoading, setAuthenticated } = authActions;

  return useMutation({
    mutationKey: ["exchange-oauth-code"],
    mutationFn: exchangeOauthCodeForAuthTokens,
    retry: false,
    onMutate: () => {
      // Cancel any outgoing refetches
      queryClient.cancelQueries({ queryKey: ["current-user"] });

      setLoading();
    },
    onSuccess: async () => {
      // Set the authentication state
      setAuthenticated();

      setStorageValue("isAuthenticated", true);

      queryClient.invalidateQueries({ queryKey: ["current-user"] });

      // Redirect to dashboard after successful login
      router.push("/dashboard");
    },
    onError: (error) => {
      setError(error);
    },
  });
}
