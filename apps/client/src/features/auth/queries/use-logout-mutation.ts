"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { logoutUser } from "../api";

export function useLogoutMutation() {
  const queryClient = useQueryClient();
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

      queryClient.setQueryData(["current-user"], null);

      // Redirect to Home page after successful logout
      router.push("/");
    },
    onError(error) {
      toast.dismiss("loadingToast");

      toast.error(error.message);
    },
  });
}
