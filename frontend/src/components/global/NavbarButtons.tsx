"use client";

import { useUserSession } from "@/hooks/useUserSession";
import LoggedInButtons from "./LoggedInButtons";
import LoggedOutButtons from "./LoggedOutButtons";

function NavbarButtons() {
  const { session, isLoading, userData } = useUserSession();

  return (
    <>
      {session?.user && userData ? (
        <LoggedInButtons userData={userData} />
      ) : (
        <LoggedOutButtons isLoading={isLoading} />
      )}
    </>
  );
}

export default NavbarButtons;
