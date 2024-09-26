import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { logoutUser } from "@/actions/auth";
import type { AuthAction } from "@/types/auth.types";

function useLogoutMutation(dispatch: React.Dispatch<AuthAction>) {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: logoutUser,
		onSuccess: () => {
			queryClient.clear();
			localStorage.clear();

			dispatch({ type: "LOGOUT" });
			router.push("/");
		},
		onError: () => {
			dispatch({
				type: "REQUEST_FAIL",
				payload: { errorMessage: "Logout failed. Please try again." },
			});
		},
	});
}

export default useLogoutMutation;
