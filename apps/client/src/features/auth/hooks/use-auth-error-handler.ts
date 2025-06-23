"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuthStore } from "../store";

export function useAuthErrorHandler() {
  const queryClient = useQueryClient();
  const { setUnAuthenticated, clearError } = useAuthStore();

  const router = useRouter();

  useEffect(() => {
    // Global error handler for authentication errors
    const handleAuthError = (error: Error) => {
      if (
        error.name === "UnauthorizedError"
        || error.message.includes("not authorized")
        || error.message.includes("Not authenticated")
      ) {
        // Clear auth state and redirect to login
        setUnAuthenticated();
        clearError();
        queryClient.clear();

        router.push("/login");
      }
    };

    // Set up global error handler
    queryClient.getQueryCache().subscribe((event) => {
      if (event.type === "updated" && event.action.type === "error") {
        handleAuthError(event.action.error);
      }
    });

    queryClient.getMutationCache().subscribe((event) => {
      if (event.type === "updated" && event.action.type === "error") {
        handleAuthError(event.action.error);
      }
    });
  }, [queryClient, setUnAuthenticated, clearError]);
}
