"use client";

import { useSession } from "@/features/auth/hooks";
import { AuthenticatedNavItems, AuthenticationButtons } from "@/shared/components";

export function AuthNavActions() {
  const { isAuthenticated } = useSession();

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
