"use client";

import type { User } from "@tubenote/db";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface UserState {
  user: User | undefined;
  isUserLoading: boolean;
  userError: Error | null;
}

interface UserStore extends UserState {
  userActions: {
    setUser: (user: User | undefined) => void;
    setUserLoading: (isLoading: boolean) => void;
    setUserError: (error: Error | null) => void;
  };
}

export const useUserStore = create<UserStore>()(
  immer(set => ({
    user: undefined,
    isUserLoading: false,
    userError: null,

    userActions: {
      setUser: user =>
        set((state) => {
          state.user = user;
        }),

      setUserLoading: isLoading =>
        set((state) => {
          state.isUserLoading = isLoading;
        }),

      setUserError: error =>
        set((state) => {
          state.userError = error;
        }),
    },
  })),
);
