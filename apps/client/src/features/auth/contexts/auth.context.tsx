"use client";
import { createContext, useContext, useReducer } from "react";

import {
  useLogin,
  useLogout,
  useRegister,
  useResetPassword,
  useSendForgotPasswordEmail,
} from "../hooks";
import { useAuthReducer } from "../reducers";
import type { AuthContextType, AuthProviderProps } from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const { authInitialState, authReducer } = useAuthReducer();
  const [authState, dispatch] = useReducer(authReducer, authInitialState);

  const registerMutation = useRegister(dispatch);
  const loginMutation = useLogin(dispatch);
  const logoutMutation = useLogout(dispatch);

  const resetPasswordMutation = useResetPassword(dispatch);
  const sendForgotPasswordEmailMutation = useSendForgotPasswordEmail(dispatch);

  const value = {
    authState,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    sendForgotPasswordEmail: sendForgotPasswordEmailMutation.mutate,
    isLoginPending: loginMutation.isPending,
    isRegistrationPending: registerMutation.isPending,
    isLogoutPending: logoutMutation.isPending,
    isResetPasswordPending: resetPasswordMutation.isPending,
    isForgotPasswordPending: sendForgotPasswordEmailMutation.isPending,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
