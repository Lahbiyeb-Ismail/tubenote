import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { sendForgotPasswordEmail } from "@/actions/password.actions";
import type { TypedError } from "@/types";

function useSendForgotPasswordEmail() {
  const router = useRouter();

  return useMutation({
    mutationFn: sendForgotPasswordEmail,
    onMutate: () => {
      toast.loading("Sending...", { id: "loadingToast" });
    },
    onSuccess: async (data) => {
      toast.dismiss("loadingToast");

      toast.success(data.message);

      router.push("/forgot-password/done");
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

export default useSendForgotPasswordEmail;
