import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { sendEmailVerification } from "@/actions/email.actions";
import type { TypedError } from "@/types";

function useSendEmailVerification() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: sendEmailVerification,
		onMutate: () => {
			toast.loading("Sending...", { id: "loadingToast" });
		},
		onSuccess: async (data) => {
			toast.dismiss("loadingToast");

			toast.success(data.message);

			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
		onError: (error: TypedError) => {
			toast.dismiss("loadingToast");
			if (error.response) {
				toast.error(error.response.data.message);
			} else {
				toast.error("Sending email verification faild. Please try again.");
			}
		},
	});
}

export default useSendEmailVerification;
