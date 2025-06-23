"use client";

import type React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { useAuthErrorHandler } from "@/features/auth/hooks/use-auth-error-handler";

function QueryProviderInner({ children }: { children: React.ReactNode }) {
  useAuthErrorHandler();
  return <>{children}</>;
}

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: (failureCount, error) => {
              // Don't retry on 4xx errors
              if (error instanceof Error && "status" in error) {
                const status = (error as any).status;
                if (status >= 400 && status < 500) {
                  return false;
                }
              }
              return failureCount < 3;
            },
          },
          mutations: {
            retry: (failureCount, error) => {
              // Don't retry auth mutations
              if (
                error instanceof Error
                && (error.message.includes("Login") || error.message.includes("Authentication"))
              ) {
                return false;
              }
              return failureCount < 2;
            },
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <QueryProviderInner>
        {children}
      </QueryProviderInner>
    </QueryClientProvider>
  );
}
