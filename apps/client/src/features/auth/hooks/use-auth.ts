"use client";

import { useAuthStore } from "../store";
import { useLogin } from "./use-login";
import { useLogout } from "./use-logout";

export function useAuth() {
  const { isAuthenticated, isLoading, error, clearError } = useAuthStore();

  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  return {
    // Auth state
    isAuthenticated,
    isLoading,
    error,
    clearError,

    // Login
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoginLoading: loginMutation.isPending,
    loginError: loginMutation.error,

    // Logout
    logout: logoutMutation.mutate,
    logoutAsync: logoutMutation.mutateAsync,
    isLogoutLoading: logoutMutation.isPending,
    logoutError: logoutMutation.error,

    // Reset mutations
    resetLogin: loginMutation.reset,
    resetLogout: logoutMutation.reset,
  };
}
