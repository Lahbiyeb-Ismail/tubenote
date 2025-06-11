"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { getAuthStatusFromCookie, setAuthStatusCookie } from "@/utils";

// Define authentication state types
export type AuthStatus = "authenticated" | "unauthenticated";

interface AuthState {
  status: AuthStatus;
  error: Error | null;
}

interface AuthStore extends AuthState {
  authActions: {
    setAuthenticated: () => void;
    setUnauthenticated: (error?: Error) => void;
    setError: (error: Error) => void;
    clearError: () => void;
  };
}

export const useAuthStore = create<AuthStore>()(
  immer(set => ({
    status: getAuthStatusFromCookie(),
    user: null,
    error: null,

    authActions: {
      setAuthenticated: () =>
        set((state) => {
          state.status = "authenticated";
          state.error = null;
          setAuthStatusCookie("authenticated");
        }),

      setUnauthenticated: error =>
        set((state) => {
          state.status = "unauthenticated";
          state.error = error || null;
          setAuthStatusCookie("unauthenticated");
        }),

      setError: error =>
        set((state) => {
          state.error = error;
          state.status = "unauthenticated";
          setAuthStatusCookie("unauthenticated");
        }),

      clearError: () =>
        set((state) => {
          state.error = null;
        }),
    },
  })),
);
