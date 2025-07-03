import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateCurrentUser } from "../services";

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCurrentUser,
    onMutate: () => {
      toast.loading("Updating user...", { id: "loadingToast" });
    },
    onSuccess: (response) => {
      const { payload } = response;

      toast.success(payload.message);
    },
    onError(error) {
      toast.error(error.message);
    },
    onSettled: () => {
      toast.dismiss("loadingToast");
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
  });
}
