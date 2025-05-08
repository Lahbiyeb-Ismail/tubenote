"use client";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

import { useGetCurrentUser } from "@/features/user/hooks";
import { useAuthStore } from "@/stores/auth-store";
import {
  useExchangeOauthCode,
  useLogin,
  useLogout,
  useRegister,
  useResetPassword,
  useSendForgotPasswordEmail,
  useSendVerificationEmail,
} from "../hooks";
import { useAuthReducer } from "../reducers";
import type { AuthContextType, AuthProviderProps } from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const { authInitialState, authReducer } = useAuthReducer();
  const [authState, dispatch] = useReducer(authReducer, authInitialState);

  // Access auth store actions
  const authActions = useAuthStore((state) => state.actions);

  // Integrate the useGetCurrentUser hook to fetch user data when authenticated
  const currentUserQueryResult = useGetCurrentUser(
    authInitialState.isAuthenticated
  );

  // Update Zustand store when auth state changes
  useEffect(() => {
    if (authState.isAuthenticated && currentUserQueryResult.data) {
      authActions.setAuthenticated(currentUserQueryResult.data);
    } else if (authState.isLoading) {
      authActions.setLoading();
    } else {
      authActions.setUnauthenticated();
    }
  }, [
    authState.isAuthenticated,
    authState.isLoading,
    currentUserQueryResult.data,
    authActions,
  ]);

  // Create memoized mutation results to prevent unnecessary re-renders
  const registerMutationResult = useRegister(dispatch);
  const loginMutationResult = useLogin(dispatch);
  const logoutMutationResult = useLogout(dispatch);
  const resetPasswordMutationResult = useResetPassword(dispatch);
  const sendForgotPasswordEmailMutationResult =
    useSendForgotPasswordEmail(dispatch);
  const sendVerificationEmailMutationResult =
    useSendVerificationEmail(dispatch);
  const exchangeOauthCodeMutationResult = useExchangeOauthCode(dispatch);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      authState,
      currentUserQueryResult,
      loginMutationResult,
      registerMutationResult,
      logoutMutationResult,
      resetPasswordMutationResult,
      sendForgotPasswordEmailMutationResult,
      sendVerificationEmailMutationResult,
      exchangeOauthCodeMutationResult,
    }),
    [
      authState,
      currentUserQueryResult,
      loginMutationResult,
      registerMutationResult,
      logoutMutationResult,
      resetPasswordMutationResult,
      sendForgotPasswordEmailMutationResult,
      sendVerificationEmailMutationResult,
      exchangeOauthCodeMutationResult,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

// Create a simpler hook for components that only need auth status
export function useAuthStatus() {
  const { status, user, error } = useAuthStore();
  return { status, user, error };
}
