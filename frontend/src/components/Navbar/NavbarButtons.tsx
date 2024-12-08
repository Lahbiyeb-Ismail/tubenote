"use client";

import useGetCurrentUser from "@/hooks/user/useGetCurrentUser";

import LoggedInButtons from "./LoggedInButtons";
import LoggedOutButtons from "./LoggedOutButtons";

function NavbarButtons() {
  const { data: currentUser, isLoading } = useGetCurrentUser();

  return (
    <>
      {currentUser && !isLoading ? <LoggedInButtons /> : <LoggedOutButtons />}
    </>
  );
}

export default NavbarButtons;
