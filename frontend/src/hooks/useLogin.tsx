"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { loginUser } from "@/actions/auth.actions";

import type { TypedError } from "@/types";
import type { AuthAction } from "@/types/auth.types";

function useLogin(dispatch: React.Dispatch<AuthAction>) {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: loginUser,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["user"] });

			dispatch({
				type: "LOGIN_SUCCESS",
				payload: {
					message: data.message,
					accessToken: data.accessToken,
					user: data.user,
				},
			});

			console.log(data);
			// router.push("/");
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

export default useLogin;
