"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { setStorageValue } from "@/shared/utils";

import { registerUser } from "../api";
import { useAuthStore } from "../store";

export function useRegisterMutation() {
  const router = useRouter();
  const { setError } = useAuthStore();

  return useMutation({
    mutationFn: registerUser,
    onMutate: () => {
      toast.loading("Registering...", { id: "loadingToast" });
    },
    onSuccess: (responseData) => {
      const { payload } = responseData;

      toast.success(payload.message);

      setStorageValue("userEmail", payload.data);

      router.push("/verify-email");
    },
    onError: (error) => {
      toast.error(error.message);

      setError(error.message);
    },
    onSettled: () => {
      // Clean up loading states regardless of outcome
      toast.dismiss("loadingToast");
    },
  });
}
