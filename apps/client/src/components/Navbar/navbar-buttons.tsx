"use client";

import { useGetCurrentUser } from "@/features/user/hooks";

import LoggedInButtons from "./LoggedInButtons";
import LoggedOutButtons from "./LoggedOutButtons";

function NavbarButtons() {
  const { data: response, isLoading } = useGetCurrentUser();

  const currentUser = response?.payload.data;

  return (
    <>
      {currentUser && !isLoading ? <LoggedInButtons /> : <LoggedOutButtons />}
    </>
  );
}

export default NavbarButtons;
