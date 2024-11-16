import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { sendPasswordResetEmail } from "@/actions/password.actions";
import type { TypedError } from "@/types";

function useSendPasswordResetEmail() {
	const router = useRouter();

	return useMutation({
		mutationFn: sendPasswordResetEmail,
		onMutate: () => {
			toast.loading("Sending...", { id: "loadingToast" });
		},
		onSuccess: async (data) => {
			toast.dismiss("loadingToast");

			toast.success(data.message);

			router.push("/password-reset/done");
		},
		onError: (error: TypedError) => {
			toast.dismiss("loadingToast");
			if (error.response) {
				toast.error(error.response.data.message);
			} else {
				toast.error("Sending password reset email faild. Please try again.");
			}
		},
	});
}

export default useSendPasswordResetEmail;
