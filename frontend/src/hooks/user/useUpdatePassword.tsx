import { updatePassword } from "@/actions/user.actions";
import { useAuth } from "@/context/useAuth";
import type { TypedError } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function useUpdatePassword() {
	const queryClient = useQueryClient();
	const { logout } = useAuth();

	return useMutation({
		mutationFn: updatePassword,
		onMutate: () => {
			toast.loading("Updating password...", { id: "loadingToast" });
		},
		onSuccess: () => {
			toast.dismiss("loadingToast");

			toast.success("Password updated successfully.");
			queryClient.invalidateQueries({ queryKey: ["user"] });
			logout();
		},
		onError: (error: TypedError) => {
			toast.dismiss("loadingToast");
			if (error.response) {
				toast.error(error.response.data.message);
			} else {
				toast.error("Password update failed. Please try again.");
			}
		},
	});
}

export default useUpdatePassword;
