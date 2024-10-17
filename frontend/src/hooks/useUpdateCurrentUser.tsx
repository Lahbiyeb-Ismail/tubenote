import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCurrentUser } from "@/actions/user.actions";
import type { TypedError } from "@/types";
import type { UserAction } from "@/context/useUser";

function useUpdateCurrentUser(dispatch: React.Dispatch<UserAction>) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateCurrentUser,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["users"] });

			dispatch({
				type: "UPDATE_USER",
				payload: { user: data, message: "User updated successfully." },
			});
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
