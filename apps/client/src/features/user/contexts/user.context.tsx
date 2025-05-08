"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

import { useAuth } from "@/features/auth/contexts/auth.context";
import { useUserStore } from "@/stores/user-store";
import { useUpdateUser } from "../hooks";
import { userReducer } from "../reducers";
import type { UserContextType, UserProviderProps, UserState } from "../types";

const userContext = createContext<UserContextType | undefined>(undefined);

const userInitialState: UserState = {
  message: "",
};

export function UserProvider({ children }: UserProviderProps) {
  const [state, dispatch] = useReducer(userReducer, userInitialState);
  const { currentUserQueryResult } = useAuth();

  // Access Zustand store actions
  const userActions = useUserStore((state) => state.actions);

  const updateUserMutation = useUpdateUser(dispatch);

  // Sync the user data from auth context to our user store
  useEffect(() => {
    if (currentUserQueryResult.data) {
      userActions.setUser(currentUserQueryResult.data);
    }

    userActions.setLoading(
      currentUserQueryResult.isLoading || updateUserMutation.isPending
    );

    const error = currentUserQueryResult.error || updateUserMutation.error;
    if (error) {
      userActions.setError(
        error instanceof Error ? error : new Error(String(error))
      );
    } else {
      userActions.setError(null);
    }
  }, [
    currentUserQueryResult.data,
    currentUserQueryResult.isLoading,
    currentUserQueryResult.error,
    updateUserMutation.isPending,
    updateUserMutation.error,
    userActions,
  ]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      state,
      updateUser: updateUserMutation.mutate,
      isLoading: updateUserMutation.isPending,
    }),
    [state, updateUserMutation.mutate, updateUserMutation.isPending]
  );

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
}

export function useUser() {
  const context = useContext(userContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}

// Create a simplified hook for components that only need user data
export function useUserData() {
  const { currentUser, isLoading, error } = useUserStore();

  return {
    user: currentUser,
    isLoading,
    error,
  };
}
