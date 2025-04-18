"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { sendVerificationEmail } from "../services";

export function useSendVerificationEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendVerificationEmail,
    onMutate: () => {
      toast.loading("Sending...", { id: "loadingToast" });
    },
    onSuccess: async (response) => {
      const { payload } = response;

      toast.dismiss("loadingToast");

      toast.success(payload.message);

      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      toast.dismiss("loadingToast");
      toast.error(error.message);
    },
  });
}
