"use client";

import { setStorageValue } from "@/utils/localStorage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { loginUser } from "../services";
import type { AuthAction } from "../types";

export function useLogin(dispatch: React.Dispatch<AuthAction>) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: loginUser,
    onMutate: () => {
      toast.loading("Logging in...", { id: "loadingToast" });
    },
    onSuccess: async (responseData) => {
      queryClient.invalidateQueries({ queryKey: ["user", "current-user"] });

      const { payload } = responseData;

      toast.dismiss("loadingToast");

      toast.success(payload.message);

      dispatch({
        type: "SET_SUCCESS_LOGIN",
        payload: {
          isAuthenticated: true,
          message: payload.message,
        },
      });

      setStorageValue("accessToken", payload.data);

      // Redirect to dashboard after successful login
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.dismiss("loadingToast");
      toast.error(error.message);

      dispatch({
        type: "SET_AUTH_ERROR",
        payload: { message: error.message },
      });
    },
  });
}
