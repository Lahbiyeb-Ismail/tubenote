"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useAppToast } from "@/shared/hooks";

import { resetPassword } from "../api";

export function useResetPasswordMutation() {
  const router = useRouter();

  const { showErrorToast, showSuccessToast, showLoadingToast, dismissToast } = useAppToast({});

  return useMutation({
    mutationFn: resetPassword,
    onMutate: () => {
      showLoadingToast({ message: "Sending...", toastId: "loadingToast" });
    },
    onSuccess: async (response) => {
      const { payload } = response;

      showSuccessToast({ message: payload.message || "Password reset successful!" });

      // Redirect to login page with success message
      router.push("/login?resetSuccess=true");
    },
    onError: (error) => {
      showErrorToast({ message: error.message || "Password reset failed. Please try again." });
    },
    onSettled: () => {
      // Clean up loading states regardless of outcome
      dismissToast({ toastId: "loadingToast" });
    },
  });
}
