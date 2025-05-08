"use client";

import { User } from "@tubenote/types";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

// Define authentication state types
export type AuthStatus = "authenticated" | "unauthenticated" | "loading";

interface AuthState {
  status: AuthStatus;
  user: User | null;
  error: Error | null;
}

interface AuthStore extends AuthState {
  actions: {
    setAuthenticated: (user: User) => void;
    setUnauthenticated: (error?: Error) => void;
    setLoading: () => void;
    clearError: () => void;
  };
}

export const useAuthStore = create<AuthStore>()(
  immer((set) => ({
    status: "loading",
    user: null,
    error: null,

    actions: {
      setAuthenticated: (user) =>
        set((state) => {
          state.status = "authenticated";
          state.user = user;
          state.error = null;
        }),

      setUnauthenticated: (error) =>
        set((state) => {
          state.status = "unauthenticated";
          state.user = null;
          state.error = error || null;
        }),

      setLoading: () =>
        set((state) => {
          state.status = "loading";
        }),

      clearError: () =>
        set((state) => {
          state.error = null;
        }),
    },
  }))
);
