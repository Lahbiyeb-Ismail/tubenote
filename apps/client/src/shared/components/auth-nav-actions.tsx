"use client";

import { useAuth } from "@/features/auth/hooks";
import { AuthenticatedNavItems, AuthenticationButtons } from "@/shared/components";

export function AuthNavActions() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="hidden md:flex items-center space-x-4">
      {
        isAuthenticated
          ? (
              <AuthenticatedNavItems />
            )
          : (
              <AuthenticationButtons />
            )
      }
    </div>
  );
}
