"use client";

import type React from "react";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { LoadingSpinner } from "@/components/ui";
import { useAuth } from "@/features/auth/contexts";

/**
 * Configuration options for the withAuth HOC
 * @interface WithAuthOptions
 */
export interface WithAuthOptions {
  /**
   * The path to redirect to if the user is not authenticated
   * @default "/login"
   */
  redirectTo?: string;

  /**
   * Whether to include the current path as a return URL parameter
   * @default true
   */
  includeReturnUrl?: boolean;

  /**
   * Custom loading component to show while checking authentication
   * @default null
   */
  LoadingComponent?: React.ComponentType;

  /**
   * Role(s) required to access the component
   * @default undefined
   */
  requiredRoles?: string | string[];
}

/**
 * Higher-Order Component that protects routes requiring authentication
 *
 * @param WrappedComponent - The component to wrap with authentication logic
 * @param options - Configuration options for authentication behavior
 * @returns A new component with authentication protection
 *
 * @example
 * // Basic usage
 * const ProtectedPage = withAuth(MyPage);
 *
 * @example
 * // With custom options
 * const AdminPage = withAuth(AdminDashboard, {
 *   redirectTo: "/auth/login",
 *   requiredRoles: "admin",
 *   LoadingComponent: MyCustomLoader
 * });
 */
function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const {
    redirectTo = "/login",
    includeReturnUrl = true,
    LoadingComponent = LoadingSpinner,
  } = options;

  // Use a meaningful display name for debugging
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";

  function WithAuth(props: P) {
    const router = useRouter();
    const pathname = usePathname();

    const { authState } = useAuth();
    const { isAuthenticated } = authState;
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
      // Check if user is authenticated
      if (!isAuthenticated) {
        // Build redirect URL with return path if needed
        let redirectPath = redirectTo;
        if (includeReturnUrl && pathname) {
          const returnUrl = encodeURIComponent(pathname);
          redirectPath = `${redirectTo}?returnUrl=${returnUrl}`;
        }

        router.push(redirectPath);
        return;
      }

      setIsAuthorized(true);
    }, [isAuthenticated, router, pathname]);

    // Show loading state while checking authentication
    if (isAuthorized === null) {
      return LoadingComponent ? <LoadingComponent /> : null;
    }

    // Show nothing if not authorized (redirect is in progress)
    if (!isAuthorized) {
      return null;
    }

    // User is authenticated and authorized, render the protected component
    return <WrappedComponent {...props} />;
  }

  WithAuth.displayName = `withAuth(${displayName})`;

  return WithAuth;
}

export default withAuth;
