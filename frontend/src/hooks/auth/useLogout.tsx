import type React from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { logoutUser } from "@/actions/auth.actions";
import type { TypedError } from "@/types";
import type { AuthAction } from "@/types/auth.types";
import toast from "react-hot-toast";

function useLogout(dispatch: React.Dispatch<AuthAction>) {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: logoutUser,
		onMutate: () => {
			toast.loading("Logging out...", { id: "loadingToast" });
		},
		onSuccess: () => {
			toast.dismiss("loadingToast");

			toast.success("Logged out successfully.");
			queryClient.invalidateQueries({ queryKey: ["user", "current-user"] });

			localStorage.clear();
			dispatch({ type: "LOGOUT_SUCCESS" });

			window.location.reload();
		},
		onError(error: TypedError) {
			toast.dismiss("loadingToast");
			if (error.response) {
				toast.error(error.response.data.message);
				dispatch({
					type: "REQUEST_FAIL",
					payload: { errorMessage: error.response.data.message },
				});
			} else {
				toast.error("Logout failed. Please try again.");
				dispatch({
					type: "REQUEST_FAIL",
					payload: { errorMessage: "Logout failed. Please try again." },
				});
			}
		},
	});
}

export default useLogout;
