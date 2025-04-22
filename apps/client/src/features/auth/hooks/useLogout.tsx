"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type React from "react";
import toast from "react-hot-toast";

import { logoutUser } from "../services";
import type { AuthAction } from "../types";

export function useLogout(dispatch: React.Dispatch<AuthAction>) {
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

      dispatch({
        type: "SET_SUCCESS_LOGOUT",
        payload: { message: responseData.payload.message },
      });

      localStorage.clear();

      // Redirect to Home page after successful logout
      router.push("/");
    },
    onError(error) {
      toast.dismiss("loadingToast");

      toast.error(error.message);

      dispatch({
        type: "SET_AUTH_ERROR",
        payload: { message: error.message },
      });
    },
  });
}
