import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useAuth } from "@/features/auth/contexts";
import { updatePassword } from "../services";

function useUpdatePassword() {
  const queryClient = useQueryClient();
  const { logout } = useAuth();

  return useMutation({
    mutationFn: updatePassword,
    onMutate: () => {
      toast.loading("Updating password...", { id: "loadingToast" });
    },
    onSuccess: (response) => {
      const { payload } = response;

      toast.dismiss("loadingToast");
      toast.success(payload.message);

      queryClient.invalidateQueries({ queryKey: ["user", "current-user"] });
      logout();
    },
    onError: (error) => {
      toast.dismiss("loadingToast");
      toast.error(error.message);
    },
  });
}

export default useUpdatePassword;
