import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { UserAction } from "@/types/user.types";
import { updateCurrentUser } from "../services";

export function useUpdateUser(dispatch: React.Dispatch<UserAction>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCurrentUser,
    onMutate: () => {
      toast.loading("Updating user...", { id: "loadingToast" });
    },
    onSuccess: (response) => {
      const { payload } = response;

      toast.dismiss("loadingToast");

      toast.success(payload.message);

      queryClient.invalidateQueries({ queryKey: ["user", "current-user"] });

      dispatch({
        type: "UPDATE_USER",
        payload: { message: payload.message },
      });

      window.location.reload();
    },
    onError(error) {
      toast.dismiss("loadingToast");
      toast.error(error.message);

      dispatch({
        type: "UPDATE_USER_FAILD",
        payload: { message: error.message },
      });
    },
  });
}
