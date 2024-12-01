import { updateCurrentUser } from "@/actions/user.actions";
import type { TypedError } from "@/types";
import type { UserAction } from "@/types/user.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function useUpdateCurrentUser(dispatch: React.Dispatch<UserAction>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCurrentUser,
    onMutate: () => {
      toast.loading("Updating user...", { id: "loadingToast" });
    },
    onSuccess: (data) => {
      toast.dismiss("loadingToast");

      toast.success("User updated successfully.");

      queryClient.invalidateQueries({ queryKey: ["user"] });

      dispatch({
        type: "UPDATE_USER",
        payload: { message: "User updated successfully." },
      });

      window.location.reload();
    },
    onError(error: TypedError) {
      toast.dismiss("loadingToast");
      if (error.response) {
        toast.error(error.response.data.message);
        dispatch({
          type: "UPDATE_USER_FAILD",
          payload: { message: error.response.data.message },
        });
      } else {
        toast.error("User update faild. Please try again.");
        dispatch({
          type: "UPDATE_USER_FAILD",
          payload: { message: "User update faild." },
        });
      }
    },
  });
}

export default useUpdateCurrentUser;
