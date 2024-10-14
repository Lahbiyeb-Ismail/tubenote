import { useMutation, useQueryClient } from "@tanstack/react-query";

import { logoutUser } from "@/actions/auth.actions";
import type { TypedError } from "@/types";

function useLogout() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: logoutUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
			localStorage.removeItem("accessToken");
		},
		onError(error: TypedError) {
			if (error.response) {
			} else {
				console.log("Logout failed. Please try again.");
			}
		},
	});
}

export default useLogout;
