"use client";

import { User } from "@tubenote/types";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface UserState {
  currentUser: User | undefined;
  isLoading: boolean;
  error: Error | null;
}

interface UserStore extends UserState {
  userActions: {
    setUser: (user: User | undefined) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: Error | null) => void;
  };
}

export const useUserStore = create<UserStore>()(
  immer((set) => ({
    currentUser: undefined,
    isLoading: false,
    error: null,

    userActions: {
      setUser: (user) =>
        set((state) => {
          state.currentUser = user;
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
