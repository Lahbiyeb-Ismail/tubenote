"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useAppToast } from "@/shared/hooks";

import { logoutUser } from "../api";

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { showErrorToast, showSuccessToast, showLoadingToast, dismissToast } = useAppToast({});

  return useMutation({
    mutationFn: logoutUser,
    onMutate: () => {
      showLoadingToast({ message: "Logging out...", toastId: "logging_out_loading" });
    },
    onSuccess: (responseData) => {
      const { payload } = responseData;

      showSuccessToast({ message: payload.message || "Logout successful!" });

      queryClient.setQueryData(["current-user"], null);

      // Redirect to Home page after successful logout
      router.push("/");
    },
    onError(error) {
      showErrorToast({ message: error.message || "Logout failed. Please try again." });
    },
    onSettled: () => {
      // Clean up loading states regardless of outcome
      dismissToast({ toastId: "logging_out_loading" });
    },
  });
}
