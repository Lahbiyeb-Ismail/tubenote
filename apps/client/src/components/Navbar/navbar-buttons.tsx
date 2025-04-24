"use client";

import { useGetCurrentUser } from "@/features/user/hooks";

import { LoggedInButtons, LoggedOutButtons } from "./";

export function NavbarButtons() {
  const { data: response, isLoading } = useGetCurrentUser();

  const currentUser = response?.payload.data;

  return (
    <>
      {currentUser && !isLoading ? <LoggedInButtons /> : <LoggedOutButtons />}
    </>
  );
}
