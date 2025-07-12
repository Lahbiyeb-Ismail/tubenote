import { useUpdatePasswordMutation, useUpdateUserMutation } from "../queries";
import { useUserStore } from "../store";

export function useUser() {
  const { user, isUserLoading, userError } = useUserStore();

  const updateUserMutation = useUpdateUserMutation();
  const updatePasswordMutation = useUpdatePasswordMutation();

  return {
    user,
    isUserLoading,
    userError,

    updateUser: updateUserMutation.mutate,
    isUpdatingUser: updateUserMutation.isPending,
    updateUserError: updateUserMutation.error,

    updatePassword: updatePasswordMutation.mutate,
    isUpdatingPassword: updatePasswordMutation.isPending,
    updatePasswordError: updatePasswordMutation.error,
  };
}
