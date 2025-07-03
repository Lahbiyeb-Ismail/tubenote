"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updatePassword } from "../services";

export function useUpdatePasswordMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePassword,
    onMutate: () => {
      toast.loading("Updating password...", { id: "loadingToast" });
    },
    onSuccess: (response) => {
      const { payload } = response;

      toast.success(payload.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      toast.dismiss("loadingToast");
      queryClient.invalidateQueries({ queryKey: ["logout-user"] });
    },
  });
}
