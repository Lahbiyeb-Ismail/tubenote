import { useUpdatePasswordMutation, useUpdateUserMutation } from "../queries";

export function useUser() {
  const updateUserMutation = useUpdateUserMutation();
  const updatePasswordMutation = useUpdatePasswordMutation();

  return {
    updateUser: updateUserMutation.mutate,
    isUpdatingUser: updateUserMutation.isPending,
    updateUserError: updateUserMutation.error,

    updatePassword: updatePasswordMutation.mutate,
    isUpdatingPassword: updatePasswordMutation.isPending,
    updatePasswordError: updatePasswordMutation.error,
  };
}
