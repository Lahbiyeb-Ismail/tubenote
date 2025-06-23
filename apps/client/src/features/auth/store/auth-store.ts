import { create } from "zustand";
import { persist } from "zustand/middleware";

import { getAuthStatusFromCookie, removeAuthStatusCookie, setAuthStatusCookie } from "@/utils";

interface AuthStore {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setAuthenticated: () => void;
  setUnAuthenticated: () => void;
  setError: (error: string) => void;
  clearError: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(set => ({
    isAuthenticated: false,
    isLoading: false,
    error: null,

    setAuthenticated: () => {
      setAuthStatusCookie("authenticated");

      set({
        isAuthenticated: true,
        isLoading: false,
      });
    },
    setUnAuthenticated: () => {
      removeAuthStatusCookie();

      set({
        isAuthenticated: false,
        isLoading: false,
      });
    },

    setError: (error: string) => {
      set({ error });
    },

    clearError: () => {
      set({ error: null });
    },
    initialize: () => {
      const isAuthenticated = getAuthStatusFromCookie();

      set({
        isAuthenticated,
        isLoading: false,
      });
    },
  }), {
    name: "auth-storage",
    // Only persist isAuthenticated, not loading states or errors
    partialize: state => ({
      isAuthenticated: state.isAuthenticated,
    }),
  }),
);
