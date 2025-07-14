"use client";
import { useGetCurrentUserQuery } from "@/features/user/queries";

/**
 * Custom hook for managing user session state.
 *
 * This hook provides a convenient interface for accessing the current user's
 * authentication status and user data by wrapping the `useGetCurrentUserQuery` hook.
 *
 * @returns An object containing:
 * - `user` - The current user data if authenticated, undefined otherwise
 * - `isLoading` - Boolean indicating if the user data is currently being fetched
 * - `isAuthenticated` - Boolean indicating if the user is successfully authenticated
 *
 */
export function useSession() {
  const { data: user, isPending, isError, isSuccess } = useGetCurrentUserQuery();

  return {
    user,
    isLoading: isPending,
    isAuthenticated: isSuccess && !isError,
  };
}
