import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { resetPassword } from "@/actions/password.actions";
import type { TypedError } from "@/types";

function useResetPassword() {
	const router = useRouter();

	return useMutation({
		mutationFn: resetPassword,
		onMutate: () => {
			toast.loading("Sending...", { id: "loadingToast" });
		},
		onSuccess: async (data) => {
			toast.dismiss("loadingToast");

			toast.success(data.message);

			router.push("/login?resetSuccess=true");
		},
		onError: (error: TypedError) => {
			toast.dismiss("loadingToast");
			if (error.response) {
				toast.error(error.response.data.message);
			} else {
				toast.error("Password Reset Faild. Please try again.");
			}
		},
	});
}

export default useResetPassword;
