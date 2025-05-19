"use client";

import { Logo, MaxWidthWrapper } from "@/components/global";
import { useUserStore } from "@/features/user/store";
import { LoggedInButtons, LoggedOutButtons } from "./";

export function Navbar() {
  const { currentUser } = useUserStore();

  return (
    <header className="sticky inset-x-0 top-0 z-[49] h-14 w-full backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <nav className="flex h-14 items-center justify-between">
          <Logo />
          {currentUser ? <LoggedInButtons /> : <LoggedOutButtons />}
        </nav>
      </MaxWidthWrapper>
    </header>
  );
}
