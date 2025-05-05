"use client";

import { useAuth } from "@/features/auth/contexts";

import { Logo, MaxWidthWrapper } from "@/components/global";
import { LoggedInButtons, LoggedOutButtons } from "./";

export function Navbar() {
  const { currentUserQueryResult } = useAuth();

  const { data: user } = currentUserQueryResult;

  return (
    <header className="sticky inset-x-0 top-0 z-[49] h-14 w-full backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <nav className="flex h-14 items-center justify-between">
          <Logo />
          {user ? <LoggedInButtons /> : <LoggedOutButtons />}
        </nav>
      </MaxWidthWrapper>
    </header>
  );
}
