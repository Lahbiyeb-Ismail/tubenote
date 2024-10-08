"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { registerUser } from "@/actions/auth";

import type { TypedError } from "@/types";
import type { AuthAction } from "@/types/auth.types";

function useRegisterMutation(dispatch: React.Dispatch<AuthAction>) {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: registerUser,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
			// dispatch({
			//   type: 'REGISTER_SUCCESS',
			//   payload: { successMessage: data.message },
			// });

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
					payload: { errorMessage: "Login failed. Please try again." },
				});
			}
		},
	});
}

export default useRegisterMutation;
