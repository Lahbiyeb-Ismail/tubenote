"use client";

import { useGetCurrentUserQuery } from "@/features/user/queries";
import { AuthenticatedNavItems, AuthenticationButtons } from "@/shared/components";

export function AuthNavActions() {
  const { isSuccess: isAuthenticated } = useGetCurrentUserQuery();

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
