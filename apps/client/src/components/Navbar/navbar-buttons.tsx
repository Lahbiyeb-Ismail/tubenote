"use client";

import { useAuth } from "@/features/auth/contexts";

import { LoggedInButtons, LoggedOutButtons } from "./";

export function NavbarButtons() {
  const { authState } = useAuth();

  return (
    <>
      {authState.isAuthenticated ? <LoggedInButtons /> : <LoggedOutButtons />}
    </>
  );
}
