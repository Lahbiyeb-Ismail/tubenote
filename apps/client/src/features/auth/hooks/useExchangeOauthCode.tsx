"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { setStorageValue } from "@/utils/localStorage";

import { exchangeOauthCodeForAuthTokens } from "../services";
import type { AuthAction } from "../types";

export function useExchangeOauthCode(dispatch: React.Dispatch<AuthAction>) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationKey: ["exchange-oauth-code"],
    mutationFn: exchangeOauthCodeForAuthTokens,
    retry: false,
    onMutate: () => {
      // Cancel any outgoing refetches
      queryClient.cancelQueries({ queryKey: ["current-user"] });
    },
    onSuccess: async (responseData) => {
      const { payload } = responseData;

      dispatch({
        type: "SET_SUCCESS_LOGIN",
        payload: {
          isAuthenticated: true,
          message: payload.message,
        },
      });

      setStorageValue("isAuthenticated", true);

      queryClient.invalidateQueries({ queryKey: ["current-user"] });

      // Redirect to dashboard after successful login
      router.push("/dashboard");
    },
    onError: (error) => {
      dispatch({
        type: "SET_AUTH_ERROR",
        payload: { message: error.message },
      });
    },
  });
}
