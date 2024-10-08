"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { TypedError } from "@/types";

import type { AuthAction } from "@/types/auth.types";
import { loginUser } from "@/actions/auth";

function useLoginMutation(dispatch: React.Dispatch<AuthAction>) {
	const queryClient = useQueryClient();

	const router = useRouter();

	return useMutation({
		mutationFn: loginUser,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
			dispatch({
				type: "LOGIN_SUCCESS",
				payload: { accessToken: data.accessToken, user: data.user },
			});

			localStorage.setItem("user", JSON.stringify(data.user));
			localStorage.setItem("accessToken", JSON.stringify(data.accessToken));
			localStorage.setItem("isAuthenticated", JSON.stringify(true));
			// Redirect on successful login
			router.push("/dashboard");
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

export default useLoginMutation;
