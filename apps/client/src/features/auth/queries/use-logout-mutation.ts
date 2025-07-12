"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useUserStore } from "@/features/user/store";

import { logoutUser } from "../api";
import { useAuthStore } from "../store";

export function useLogoutMutation() {
  const router = useRouter();

  const { userActions } = useUserStore();

  const { authActions } = useAuthStore();

  return useMutation({
    mutationFn: logoutUser,
    onMutate: () => {
      toast.loading("Logging out...", { id: "loadingToast" });
    },
    onSuccess: (responseData) => {
      const { payload } = responseData;

      toast.dismiss("loadingToast");

      toast.success(payload.message);

      authActions.setAuthStatus(false);
      userActions.setUser(undefined);

      // Redirect to Home page after successful logout
      router.push("/");
    },
    onError(error) {
      toast.dismiss("loadingToast");

      toast.error(error.message);

      authActions.setError(error.message);
    },
  });
}
