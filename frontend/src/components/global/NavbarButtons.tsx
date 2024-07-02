"use client";

import { useUserSession } from "@/hooks/useUserSession";
import LoggedInButtons from "./LoggedInButtons";
import LoggedOutButtons from "./LoggedOutButtons";

function NavbarButtons() {
  const { userData } = useUserSession();

  return (
    <>
      {userData ? (
        <LoggedInButtons userData={userData} />
      ) : (
        <LoggedOutButtons />
      )}
    </>
  );
}

export default NavbarButtons;
