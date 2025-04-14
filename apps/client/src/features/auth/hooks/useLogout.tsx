import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type React from "react";
import toast from "react-hot-toast";

import { logoutUser } from "@/actions/auth.actions";
import type { AuthAction } from "@/types/auth.types";

export function useLogout(dispatch: React.Dispatch<AuthAction>) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logoutUser,
    onMutate: () => {
      toast.loading("Logging out...", { id: "loadingToast" });
    },
    onSuccess: (responseData) => {
      const { payload } = responseData;

      toast.dismiss("loadingToast");

      toast.success(payload.message);
      queryClient.invalidateQueries({ queryKey: ["user", "current-user"] });

      localStorage.clear();
      dispatch({ type: "LOGOUT_SUCCESS" });

      // Redirect to Home page after successful logout
      router.push("/");

      // Reload the page to clear any cached data
      window.location.reload();
    },
    onError(error) {
      toast.dismiss("loadingToast");

      toast.error(error.message);

      dispatch({
        type: "REQUEST_FAIL",
        payload: { errorMessage: error.message },
      });
    },
  });
}
