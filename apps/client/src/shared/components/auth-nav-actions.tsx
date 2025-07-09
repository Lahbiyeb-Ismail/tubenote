"use client";

import { LayoutDashboard } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui";
import { useAuth } from "@/features/auth/hooks";
import { AuthenticationButtons, UserProfileMenu } from "@/shared/components";

export function AuthNavActions() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="hidden md:flex items-center space-x-4">
      {
      /* If the user is not authenticated, show the Sign In and Get Started buttons */
        isAuthenticated
          ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="h-4 w-4" />
                  </Link>
                </Button>
                <UserProfileMenu />
              </>
            )
          : (
              <AuthenticationButtons />
            )
      }
    </div>
  );
}
