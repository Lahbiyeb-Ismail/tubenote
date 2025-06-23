"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { sendVerificationEmail } from "../services";

export function useSendVerificationEmailMutation() {
  return useMutation({
    mutationFn: sendVerificationEmail,
    onMutate: () => {
      toast.loading("Sending...", { id: "loadingToast" });
    },
    onSuccess: async (response) => {
      const { payload } = response;

      toast.dismiss("loadingToast");

      toast.success(payload.message);
    },
    onError: (error) => {
      toast.dismiss("loadingToast");
      toast.error(error.message);
    },
  });
}
