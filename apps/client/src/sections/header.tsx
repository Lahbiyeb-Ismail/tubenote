import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

import { NavigationHeader, NavLink, UserProfileMenu } from "@/components";
import { Button } from "@/components/ui";
import { useAuthStore } from "@/features/auth/store";

export function Header() {
  const { status } = useAuthStore();

  return (
    <NavigationHeader
      leftNavigationLinks={(
        <>
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#how-it-works">How it Works</NavLink>
          <NavLink href="#pricing">Pricing</NavLink>
          <NavLink href="#faq">FAQ</NavLink>
        </>
      )}

      rightNavigationLinks={(
        <>
          {status === "authenticated"
            ? (
                <Fragment>
                  <NavLink href="/dashboard">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </NavLink>
                  <UserProfileMenu />
                </Fragment>
              )
            : (
                <Fragment>
                  <Link href="/login">
                    <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      Get Started
                    </Button>
                  </Link>
                </Fragment>
              )}
        </>
      )}
    />
  );
}
