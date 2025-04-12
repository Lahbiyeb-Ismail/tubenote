"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { registerUser } from "@/actions/auth.actions";

import type { TypedError } from "@/types";
import type { AuthAction } from "@/types/auth.types";
import toast from "react-hot-toast";

function useRegister(dispatch: React.Dispatch<AuthAction>) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: registerUser,
    onMutate: () => {
      toast.loading("Registering...", { id: "loadingToast" });
    },
    onSuccess: (responseData) => {
      const { payload } = responseData;

      toast.dismiss("loadingToast");

      toast.success(payload.message);

      queryClient.invalidateQueries({ queryKey: ["user"] });

      localStorage.setItem("userEmail", payload.data);

      router.push("/verify-email");
    },
    onError: (error: TypedError) => {
      toast.dismiss("loadingToast");
      toast.error(error.message);

      dispatch({
        type: "REQUEST_FAIL",
        payload: { errorMessage: error.message },
      });
    },
  });
}

export default useRegister;
