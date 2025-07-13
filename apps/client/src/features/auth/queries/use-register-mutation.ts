"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { registerUser } from "../api";

export function useRegisterMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: registerUser,
    onMutate: () => {
      toast.loading("Registering...", { id: "loadingToast" });
    },
    onSuccess: (responseData) => {
      const { payload } = responseData;

      toast.success(payload.message);

      router.push(`/verify-email?email=${encodeURIComponent(payload.data)}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      // Clean up loading states regardless of outcome
      toast.dismiss("loadingToast");
    },
  });
}
