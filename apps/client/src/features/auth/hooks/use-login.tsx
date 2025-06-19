"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { loginUser } from "../services";
import { useAuthStore } from "../store";

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { setAuthenticated, setError } = useAuthStore();

  return useMutation({
    mutationKey: ["login-user"],
    mutationFn: loginUser,
    retry: false,
    onMutate: () => {
      // Cancel any outgoing refetches
      queryClient.cancelQueries({ queryKey: ["current-user"] });

      toast.loading("Logging in...", { id: "loadingToast" });
    },
    onSuccess: async (responseData) => {
      const { payload } = responseData;

      toast.success(payload.message);

      setAuthenticated();

      queryClient.invalidateQueries({ queryKey: ["current-user"] });

      // Redirect to dashboard after successful login
      router.push("/dashboard");
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
