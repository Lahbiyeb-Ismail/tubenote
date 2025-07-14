"use client";

import { useMutation } from "@tanstack/react-query";

import { useAppToast } from "@/shared/hooks";

import { sendVerificationEmail } from "../api";

export function useSendVerificationEmailMutation() {
  const { showErrorToast, showSuccessToast, showLoadingToast, dismissToast } = useAppToast({});

  return useMutation({
    mutationFn: sendVerificationEmail,
    onMutate: () => {
      showLoadingToast({ message: "Sending...", toastId: "loadingToast" });
    },
    onSuccess: async (response) => {
      const { payload } = response;

      showSuccessToast({ message: payload.message || "Verification email sent!" });
    },
    onError: (error) => {
      showErrorToast({ message: error.message || "Failed to send verification email." });
    },
    onSettled: () => {
      dismissToast({ toastId: "loadingToast" });
    },
  });
}
