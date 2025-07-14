"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAppToast } from "@/shared/hooks";

import { updatePassword } from "../api";

export function useUpdatePasswordMutation() {
  const queryClient = useQueryClient();

  const { showErrorToast, showSuccessToast, showLoadingToast, dismissToast } = useAppToast({});

  return useMutation({
    mutationFn: updatePassword,
    onMutate: () => {
      showLoadingToast({ message: "Updating password...", toastId: "loadingToast" });
    },
    onSuccess: (response) => {
      const { payload } = response;

      showSuccessToast({ message: payload.message || "Password updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["logout-user"] });
    },
    onError: (error) => {
      showErrorToast({ message: error.message || "Failed to update password." });
    },
    onSettled: () => {
      dismissToast({ toastId: "loadingToast" });
    },
  });
}
