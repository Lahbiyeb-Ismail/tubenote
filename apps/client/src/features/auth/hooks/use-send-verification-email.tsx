"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { sendVerificationEmail } from "../services";
import type { AuthAction } from "../types";

export function useSendVerificationEmail(dispatch: React.Dispatch<AuthAction>) {
  return useMutation({
    mutationFn: sendVerificationEmail,
    onMutate: () => {
      toast.loading("Sending...", { id: "loadingToast" });
    },
    onSuccess: async (response) => {
      const { payload } = response;

      toast.dismiss("loadingToast");

      toast.success(payload.message);

      dispatch({
        type: "SET_SUCCESS_VERIFICATION_EMAIL_SENT",
        payload: { message: payload.message },
      });
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
