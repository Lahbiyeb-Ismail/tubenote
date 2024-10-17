import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCurrentUser } from "@/actions/user.actions";
import type { TypedError } from "@/types";
import type { UserAction } from "@/types/user.types";

function useUpdateCurrentUser(dispatch: React.Dispatch<UserAction>) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateCurrentUser,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["user"] });

			dispatch({
				type: "UPDATE_USER",
				payload: { user: data.user, message: "User updated successfully." },
			});

			localStorage.setItem("user", JSON.stringify(data.user));

			window.location.reload();
		},
		onError(error: TypedError) {
			if (error.response) {
				dispatch({
					type: "UPDATE_USER_FAILD",
					payload: { message: error.response.data.message, user: null },
				});
			} else {
				dispatch({
					type: "UPDATE_USER_FAILD",
					payload: { message: "User update faild.", user: null },
				});
			}
		},
	});
}

export default useUpdateCurrentUser;
