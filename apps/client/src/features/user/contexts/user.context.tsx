"use client";

import { createContext, useContext, useReducer } from "react";

import userReducer from "@/reducers/user.reducer";
import type {
  UserContextType,
  UserProviderProps,
  UserState,
} from "@/types/user.types";
import { useUpdateUser } from "../hooks";

const userContext = createContext<UserContextType | undefined>(undefined);

const userInitialState: UserState = {
  message: "",
};

export function UserProvider({ children }: UserProviderProps) {
  const [state, dispatch] = useReducer(userReducer, userInitialState);

  const updateUserMutation = useUpdateUser(dispatch);

  const value = {
    state,
    updateUser: updateUserMutation.mutate,
    isLoading: updateUserMutation.isPending,
  };

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
}

export function useUser() {
  const context = useContext(userContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}
