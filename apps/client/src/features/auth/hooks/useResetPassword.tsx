"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { resetPassword } from "../services";
import type { AuthAction } from "../types";

export function useResetPassword(dispatch: React.Dispatch<AuthAction>) {
  const router = useRouter();

  return useMutation({
    mutationFn: resetPassword,
    onMutate: () => {
      toast.loading("Sending...", { id: "loadingToast" });
    },
    onSuccess: async (response) => {
      const { payload } = response;

      toast.dismiss("loadingToast");

      toast.success(payload.message);

      dispatch({
        type: "SET_SUCCESS_RESET_PASSWORD",
        payload: { message: payload.message },
      });

      // Redirect to login page with success message
      router.push("/login?resetSuccess=true");
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
