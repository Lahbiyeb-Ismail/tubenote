"use client";
import { createContext, useContext, useReducer } from "react";

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

  const registerMutationResult = useRegister(dispatch);
  const loginMutationResult = useLogin(dispatch);
  const logoutMutationResult = useLogout(dispatch);

  const resetPasswordMutationResult = useResetPassword(dispatch);
  const sendForgotPasswordEmailMutationResult =
    useSendForgotPasswordEmail(dispatch);
  const sendVerificationEmailMutationResult =
    useSendVerificationEmail(dispatch);

  const exchangeOauthCodeMutationResult = useExchangeOauthCode(dispatch);

  const value = {
    authState,
    loginMutationResult,
    registerMutationResult,
    logoutMutationResult,
    resetPasswordMutationResult,
    sendForgotPasswordEmailMutationResult,
    sendVerificationEmailMutationResult,
    exchangeOauthCodeMutationResult,
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
