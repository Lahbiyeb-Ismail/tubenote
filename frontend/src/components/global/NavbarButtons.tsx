/* eslint-disable @typescript-eslint/naming-convention */

"use client";

import { useUserSession } from "@/hooks/useUserSession";
import { Button } from "./Button";
import UserAvatar from "./UserAvatar";

function NavbarButtons() {
  const { session, isLoading, userData } = useUserSession();

  return (
    <>
      {session?.user && userData ? (
        <div className="flex gap-4">
          <Button href="/dashboard" size="md">
            Dashboard
          </Button>
          <Button href="/api/auth/logout" size="md" variant="secondary">
            Logout
          </Button>
          <UserAvatar imgSrc={userData.picture} username={userData.username} />
        </div>
      ) : (
        <Button href="/api/auth/login" size="md" disabled={isLoading}>
          Get Started
        </Button>
      )}
    </>
  );
}

export default NavbarButtons;
