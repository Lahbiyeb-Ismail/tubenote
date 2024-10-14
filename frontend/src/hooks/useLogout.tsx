import type React from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { logoutUser } from "@/actions/auth.actions";
import type { TypedError } from "@/types";
import type { AuthAction } from "@/types/auth.types";

function useLogout(dispatch: React.Dispatch<AuthAction>) {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: logoutUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });

			localStorage.clear();
			dispatch({ type: "LOGOUT_SUCCESS" });
		},
		onError(error: TypedError) {
			if (error.response) {
				dispatch({
					type: "REQUEST_FAIL",
					payload: { errorMessage: error.response.data.message },
				});
			} else {
				dispatch({
					type: "REQUEST_FAIL",
					payload: { errorMessage: "Logout failed. Please try again." },
				});
			}
		},
	});
}

export default useLogout;
