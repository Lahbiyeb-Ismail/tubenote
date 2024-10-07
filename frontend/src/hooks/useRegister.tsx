"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { registerUser } from "@/actions/auth.actions";

import type { TypedError } from "@/types";
import type { AuthAction } from "@/types/auth.types";

function useRegister(dispatch: React.Dispatch<AuthAction>) {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: registerUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });

			router.push("/login");
		},
		onError: (error: TypedError) => {
			if (error.response) {
				dispatch({
					type: "REQUEST_FAIL",
					payload: { errorMessage: error.response.data.message },
				});
			} else {
				dispatch({
					type: "REQUEST_FAIL",
					payload: { errorMessage: "Failed Registration. Please try again." },
				});
			}
		},
	});
}

export default useRegister;
