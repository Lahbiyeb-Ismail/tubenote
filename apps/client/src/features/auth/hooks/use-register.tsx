"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { setStorageValue } from "@/utils";

import { registerUser } from "../services";
import { useAuthStore } from "../store";

export function useRegister() {
  const router = useRouter();
  const { authActions } = useAuthStore();

  const { setLoading, setError } = authActions;

  return useMutation({
    mutationFn: registerUser,
    onMutate: () => {
      toast.loading("Registering...", { id: "loadingToast" });

      setLoading();
    },
    onSuccess: (responseData) => {
      const { payload } = responseData;

      toast.success(payload.message);

      setStorageValue("userEmail", payload.data);

      router.push("/verify-email");
    },
    onError: (error) => {
      toast.error(error.message);

      setError(error);
    },
    onSettled: () => {
      // Clean up loading states regardless of outcome
      toast.dismiss("loadingToast");
    },
  });
}
