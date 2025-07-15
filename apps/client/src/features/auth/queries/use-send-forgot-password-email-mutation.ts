"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useAppToast } from "@/shared/hooks";

import { sendForgotPasswordEmail } from "../api";

export function useSendForgotPasswordEmailMutation() {
  const router = useRouter();

  const { showErrorToast, showSuccessToast, showLoadingToast, dismissToast } = useAppToast({});

  return useMutation({
    mutationFn: sendForgotPasswordEmail,
    onMutate: () => {
      showLoadingToast({ message: "Sending...", toastId: "loadingToast" });
    },
    onSuccess: async (response) => {
      const { payload } = response;

      showSuccessToast({ message: payload.message || "Password reset email sent!" });

      router.push("/forgot-password/done");
    },
    onError: (error) => {
      showErrorToast({ message: error.message || "Failed to send password reset email." });
    },
    onSettled: () => {
      dismissToast({ toastId: "loadingToast" });
    },
  });
}
