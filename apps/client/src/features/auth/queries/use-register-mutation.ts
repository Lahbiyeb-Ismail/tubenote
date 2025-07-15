"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useAppToast } from "@/shared/hooks";

import { registerUser } from "../api";

export function useRegisterMutation() {
  const router = useRouter();

  const { showErrorToast, showSuccessToast, showLoadingToast, dismissToast } = useAppToast({});

  return useMutation({
    mutationFn: registerUser,
    onMutate: () => {
      showLoadingToast({ message: "Registering...", toastId: "loadingToast" });
    },
    onSuccess: (responseData) => {
      const { payload } = responseData;

      showSuccessToast({ message: payload.message || "Registration successful!" });

      router.push(`/verify-email?email=${encodeURIComponent(payload.data)}`);
    },
    onError: (error) => {
      showErrorToast({ message: error.message || "Registration failed. Please try again." });
    },
    onSettled: () => {
      // Clean up loading states regardless of outcome
      dismissToast({ toastId: "loadingToast" });
    },
  });
}
