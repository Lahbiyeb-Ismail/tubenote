"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { logoutUser } from "../services";
import { useAuthStore } from "../store";

export function useLogout() {
  const router = useRouter();

  const { authActions } = useAuthStore();

  const { setLoading, setUnauthenticated, setError } = authActions;

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

      localStorage.clear();

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
