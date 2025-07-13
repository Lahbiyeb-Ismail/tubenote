"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useGetCurrentUserQuery } from "@/features/user/queries";

import { Loader } from "../components";

/**
 * Higher-order component that provides authentication protection for React components.
 *
 * This HOC wraps a component and ensures that only authenticated users can access it.
 * It automatically redirects unauthenticated users to the login page and displays a
 * loader during authentication checks.
 *
 * @template P - The props type of the wrapped component
 * @param WrappedComponent - The React component to be wrapped with authentication protection
 * @returns A new component that renders the wrapped component only if the user is authenticated
 *
 * @example
 * ```tsx
 * const ProtectedDashboard = withAuth(Dashboard);
 *
 * function App() {
 *   return <ProtectedDashboard />;
 * }
 * ```
 *
 * @remarks
 * - Shows a loading spinner while authentication status is being checked
 * - Automatically redirects to "/login" if authentication fails
 * - Only renders the wrapped component when user is successfully authenticated
 * - Preserves the original component's display name for debugging purposes
 */
export function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  function WithAuth(props: P) {
    const router = useRouter();
    const { isPending, isError, isSuccess } = useGetCurrentUserQuery();

    useEffect(() => {
      if (isError) {
        router.push("/login");
      }
    }, [isError, router]);

    if (isPending || isError) {
      return <Loader />; // Show loader while checking auth status or redirecting
    }

    if (isSuccess) {
      // User is authenticated, render the component
      return <WrappedComponent {...props} />;
    }

    return null; // Should not be reached in normal flow
  }

  WithAuth.displayName = `withAuth(${(WrappedComponent.displayName || WrappedComponent.name || "Component")})`;
  return WithAuth;
}
