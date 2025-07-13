"use client";

import { useGetCurrentUserQuery } from "@/features/user/queries";
import { Logo, MaxWidthWrapper } from "@/shared/components";

import { LoggedInButtons, LoggedOutButtons } from "./";

export function Navbar() {
  const { isSuccess: isAnthenticated } = useGetCurrentUserQuery();

  return (
    <header className="sticky inset-x-0 top-0 z-[49] h-14 w-full backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <nav className="flex h-14 items-center justify-between">
          <Logo />
          {isAnthenticated ? <LoggedInButtons /> : <LoggedOutButtons />}
        </nav>
      </MaxWidthWrapper>
    </header>
  );
}
