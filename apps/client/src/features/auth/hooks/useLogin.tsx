"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { setStorageValue } from "@/utils/localStorage";
import { loginUser } from "../services";
import type { AuthAction } from "../types";

export function useLogin(dispatch: React.Dispatch<AuthAction>) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: loginUser,
    retry: false,
    onMutate: () => {
      // Cancel any outgoing refetches
      queryClient.cancelQueries({ queryKey: ["user", "current-user"] });

      toast.loading("Logging in...", { id: "loadingToast" });
    },
    onSuccess: async (responseData) => {
      const { payload } = responseData;

      toast.success(payload.message);

      dispatch({
        type: "SET_SUCCESS_LOGIN",
        payload: {
          isAuthenticated: true,
          message: payload.message,
        },
      });

      setStorageValue("isAuthenticated", true);

      queryClient.invalidateQueries({ queryKey: ["user", "current-user"] });

      // Redirect to dashboard after successful login
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message);

      dispatch({
        type: "SET_AUTH_ERROR",
        payload: { message: error.message },
      });
    },
    onSettled: () => {
      // Clean up loading states regardless of outcome
      toast.dismiss("loadingToast");
    },
  });
}
