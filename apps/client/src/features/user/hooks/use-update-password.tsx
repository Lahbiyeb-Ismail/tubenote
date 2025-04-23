"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updatePassword } from "../services";

export function useUpdatePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    // The query key is used to identify the mutation
    mutationKey: ["update-password"],
    mutationFn: updatePassword,
    onMutate: () => {
      toast.loading("Updating password...", { id: "loadingToast" });
    },
    onSuccess: (response) => {
      const { payload } = response;

      toast.dismiss("loadingToast");
      toast.success(payload.message);

      queryClient.invalidateQueries({ queryKey: ["logout-user"] });
    },
    onError: (error) => {
      toast.dismiss("loadingToast");
      toast.error(error.message);
    },
  });
}
