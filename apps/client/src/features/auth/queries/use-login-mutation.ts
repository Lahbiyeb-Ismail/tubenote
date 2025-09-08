"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useAppToast } from "@/shared/hooks";

import { loginUser } from "../api";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { showErrorToast, showSuccessToast, showLoadingToast, dismissToast } = useAppToast({});

  return useMutation({
    mutationFn: loginUser,
    retry: false,
    onMutate: () => {
      // Cancel any outgoing refetches
      queryClient.cancelQueries({ queryKey: ["current-user"] });

      showLoadingToast({ message: "Logging in...", toastId: "logging_loading" });
    },
    onSuccess: async (responseData) => {
      const { payload } = responseData;

      showSuccessToast({ message: payload.message || "Login successful!" });

      queryClient.invalidateQueries({ queryKey: ["current-user"] });

      // Redirect to notes page after successful login
      router.push("/notes");
    },
    onError: (error) => {
      showErrorToast({ message: error.message || "Login failed. Please try again." });
    },
    onSettled: () => {
      // Clean up loading states regardless of outcome
      dismissToast({ toastId: "logging_loading" });
    },
  });
}
