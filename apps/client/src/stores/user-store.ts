"use client";

import { User } from "@tubenote/types";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface UserState {
  currentUser: User | null;
  isLoading: boolean;
  error: Error | null;
}

interface UserStore extends UserState {
  actions: {
    setUser: (user: User | null) => void;
    updateUser: (updates: Partial<User>) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: Error | null) => void;
  };
}

export const useUserStore = create<UserStore>()(
  immer((set) => ({
    currentUser: null,
    isLoading: false,
    error: null,

    actions: {
      setUser: (user) =>
        set((state) => {
          state.currentUser = user;
        }),

      updateUser: (updates) =>
        set((state) => {
          if (state.currentUser) {
            state.currentUser = { ...state.currentUser, ...updates };
          }
        }),

      setLoading: (isLoading) =>
        set((state) => {
          state.isLoading = isLoading;
        }),

      setError: (error) =>
        set((state) => {
          state.error = error;
        }),
    },
  }))
);
