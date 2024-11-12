"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
		onSuccess: (data) => {
			toast.dismiss("loadingToast");

			toast.success(data.message);

			queryClient.invalidateQueries({ queryKey: ["user"] });

			localStorage.setItem("userEmail", data.email);

			router.push("/verify-email");
		},
		onError: (error: TypedError) => {
			toast.dismiss("loadingToast");

			if (error.response) {
				toast.error(error.response.data.message);

				dispatch({
					type: "REQUEST_FAIL",
					payload: { errorMessage: error.response.data.message },
				});
			} else {
				toast.error("Failed Registration. Please try again.");

				dispatch({
					type: "REQUEST_FAIL",
					payload: { errorMessage: "Failed Registration. Please try again." },
				});
			}
		},
	});
}

export default useRegister;
