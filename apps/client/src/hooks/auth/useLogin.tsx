"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { loginUser } from "@/actions/auth.actions";

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
    onSuccess: async (responseData) => {
      const { payload } = responseData;

      toast.dismiss("loadingToast");

      toast.success(payload.message);

      queryClient.invalidateQueries({ queryKey: ["user", "current-user"] });

      setStorageValue("accessToken", payload.data);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          message: payload.message,
          accessToken: payload.data,
        },
      });

      await refetchCurrentUser();

      // Redirect to dashboard after successful login
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.dismiss("loadingToast");
      toast.error(error.message);
    },
  });
}

export default useLogin;
