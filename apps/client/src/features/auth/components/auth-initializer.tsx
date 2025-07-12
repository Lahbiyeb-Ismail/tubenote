"use client";

import type React from "react";

import { useEffect } from "react";

import { useGetCurrentUserQuery } from "@/features/user/queries";
import { useUserStore } from "@/features/user/store";
// import { Loader } from "@/shared/components";

import { useAuthStore } from "../store";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { authActions } = useAuthStore();
  const { userActions } = useUserStore();
  const { data: user, isPending, isError, isSuccess } = useGetCurrentUserQuery();

  useEffect(() => {
    userActions.setUserLoading(isPending);

    if (isSuccess && user) {
      authActions.setAuthStatus(true);

      userActions.setUser(user);
      userActions.setUserError(null);
    }

    if (isError) {
      authActions.setAuthStatus(false);
      userActions.setUser(undefined);
      userActions.setUserError(new Error("Failed to fetch current user"));
    }

    // Clear loading state after the query resolves
    userActions.setUserLoading(false);
  }, [isPending, isSuccess, isError, user, authActions, userActions]);

  return <>{children}</>;
}
