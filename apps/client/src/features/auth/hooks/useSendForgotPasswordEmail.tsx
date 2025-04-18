"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { sendForgotPasswordEmail } from "../services";
import type { AuthAction } from "../types";

export function useSendForgotPasswordEmail(
  dispatch: React.Dispatch<AuthAction>
) {
  const router = useRouter();

  return useMutation({
    mutationFn: sendForgotPasswordEmail,
    onMutate: () => {
      toast.loading("Sending...", { id: "loadingToast" });
    },
    onSuccess: async (response) => {
      const { payload } = response;

      toast.dismiss("loadingToast");

      toast.success(payload.message);

      dispatch({
        type: "SET_SUCCESS_FORGOT_EMAIL_SENT",
        payload: { message: payload.message },
      });

      router.push("/forgot-password/done");
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
