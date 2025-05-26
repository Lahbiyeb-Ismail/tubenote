"use client";

import { getAuthStatusFromCookie, setAuthStatusCookie } from "@/utils";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

// Define authentication state types
export type AuthStatus = "authenticated" | "unauthenticated" | "loading";

interface AuthState {
  status: AuthStatus;
  error: Error | null;
}

interface AuthStore extends AuthState {
  authActions: {
    setAuthenticated: () => void;
    setUnauthenticated: (error?: Error) => void;
    setError: (error: Error) => void;
    setLoading: () => void;
    clearError: () => void;
  };
}

export const useAuthStore = create<AuthStore>()(
  immer((set) => ({
    status: getAuthStatusFromCookie() ?? "unauthenticated",
    user: null,
    error: null,

    authActions: {
      setAuthenticated: () =>
        set((state) => {
          state.status = "authenticated";
          state.error = null;
          setAuthStatusCookie("authenticated");
        }),

      setUnauthenticated: (error) =>
        set((state) => {
          state.status = "unauthenticated";
          state.error = error || null;
          setAuthStatusCookie("unauthenticated");
        }),

      setError: (error) =>
        set((state) => {
          state.error = error;
          state.status = "unauthenticated";
          setAuthStatusCookie("unauthenticated");
        }),

      setLoading: () =>
        set((state) => {
          state.status = "loading";
          setAuthStatusCookie("loading");
        }),

      clearError: () =>
        set((state) => {
          state.error = null;
        }),
    },
  }))
);
