"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useUserStore } from "@/features/user/store";
import { removeAuthStatusCookie } from "@/utils";
import { logoutUser } from "../services";
import { useAuthStore } from "../store";

export function useLogout() {
  const router = useRouter();

  const { authActions } = useAuthStore();
  const { userActions } = useUserStore();

  const { setLoading, setUnauthenticated, setError } = authActions;
  const { setUser } = userActions;

  return useMutation({
    // The query key is used to identify the mutation
    mutationKey: ["logout-user"],
    mutationFn: logoutUser,
    onMutate: () => {
      toast.loading("Logging out...", { id: "loadingToast" });

      setLoading();
    },
    onSuccess: (responseData) => {
      const { payload } = responseData;

      toast.dismiss("loadingToast");

      toast.success(payload.message);

      setUnauthenticated();
      setUser(undefined);

      // Clear cookies
      removeAuthStatusCookie();

      // Redirect to Home page after successful logout
      router.push("/");
    },
    onError(error) {
      toast.dismiss("loadingToast");

      toast.error(error.message);

      setError(error);
    },
  });
}
