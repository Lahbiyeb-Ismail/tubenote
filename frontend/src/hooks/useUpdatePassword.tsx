import { updatePassword } from "@/actions/user.actions";
import { useAuth } from "@/context/useAuth";
import type { TypedError } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useUpdatePassword() {
	const queryClient = useQueryClient();
	const { logout } = useAuth();

	return useMutation({
		mutationFn: updatePassword,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
			logout();
		},
		onError: (error: TypedError) => {
			if (error.response) {
				console.log(error.response.data.message);
			} else {
				console.log(error.message);
			}
		},
	});
}

export default useUpdatePassword;
