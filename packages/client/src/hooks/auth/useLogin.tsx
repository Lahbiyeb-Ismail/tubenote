"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { loginUser } from "@/actions/auth.actions";

import type { TypedError } from "@/types";
import type { AuthAction } from "@/types/auth.types";
import { setStorageValue } from "@/utils/localStorage";
import useGetCurrentUser from "../user/useGetCurrentUser";

function useLogin(dispatch: React.Dispatch<AuthAction>) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { refetch: refetchCurrentUser } = useGetCurrentUser();

  return useMutation({
    mutationFn: loginUser,
    onMutate: () => {
      toast.loading("Logging in...", { id: "loadingToast" });
    },
    onSuccess: async (data) => {
      toast.dismiss("loadingToast");

      toast.success(data.message);

      queryClient.invalidateQueries({ queryKey: ["user", "current-user"] });

      setStorageValue("accessToken", data.accessToken);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          message: data.message,
          accessToken: data.accessToken,
        },
      });

      await refetchCurrentUser();

      // Redirect to dashboard after successful login
      router.push("/dashboard");
    },
    onError: (error: TypedError) => {
      toast.dismiss("loadingToast");
      if (error.response) {
        toast.error(error.response.data.message);
        // dispatch({
        // 	type: "REQUEST_FAIL",
        // 	payload: { errorMessage: error.response.data.message },
        // });
      } else {
        toast.error("Login failed. Please try again.");
        // dispatch({
        // 	type: "REQUEST_FAIL",
        // 	payload: { errorMessage: "Login failed. Please try again." },
        // });
      }
    },
  });
}

export default useLogin;
