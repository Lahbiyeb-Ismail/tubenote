"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { setStorageValue } from "@/utils/localStorage";

import { registerUser } from "../services";
import type { AuthAction } from "../types";

export function useRegister(dispatch: React.Dispatch<AuthAction>) {
  const router = useRouter();

  return useMutation({
    mutationFn: registerUser,
    onMutate: () => {
      toast.loading("Registering...", { id: "loadingToast" });
    },
    onSuccess: (responseData) => {
      const { payload } = responseData;

      toast.dismiss("loadingToast");

      toast.success(payload.message);

      dispatch({
        type: "SET_SUCCESS_REGISTER",
        payload: { message: payload.message },
      });

      setStorageValue("userEmail", payload.data);

      router.push("/verify-email");
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
