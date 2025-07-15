import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAppToast } from "@/shared/hooks";

import { updateCurrentUser } from "../api";

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  const { showErrorToast, showSuccessToast, showLoadingToast, dismissToast } = useAppToast({});

  return useMutation({
    mutationFn: updateCurrentUser,
    onMutate: () => {
      showLoadingToast({ message: "Updating user...", toastId: "loadingToast" });
    },
    onSuccess: (response) => {
      const { payload } = response;

      showSuccessToast({ message: payload.message || "User updated successfully!" });
    },
    onError(error) {
      showErrorToast({ message: error.message || "Failed to update user." });
    },
    onSettled: () => {
      dismissToast({ toastId: "loadingToast" });
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
  });
}
