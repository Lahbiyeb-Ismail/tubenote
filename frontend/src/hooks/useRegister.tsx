"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { registerUser } from "@/actions/auth.actions";

import type { TypedError } from "@/types";

function useRegister() {
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
				console.log(error.response.data.message);
			} else {
				console.log("Login failed. Please try again.");
			}
		},
	});
}

export default useRegister;
