"use client";
import { createContext, useContext, useReducer } from "react";

import { useLogin, useLogout, useRegister } from "../hooks";
import { useAuthReducer } from "../reducers";
import type { AuthContextType, AuthProviderProps } from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const { authInitialState, authReducer } = useAuthReducer();
  const [authState, dispatch] = useReducer(authReducer, authInitialState);

  const registerMutation = useRegister(dispatch);
  const loginMutation = useLogin(dispatch);
  const logoutMutation = useLogout(dispatch);

  const value = {
    authState,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginPending: loginMutation.isPending,
    isRegistrationPending: registerMutation.isPending,
    isLogoutPending: logoutMutation.isPending,
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
