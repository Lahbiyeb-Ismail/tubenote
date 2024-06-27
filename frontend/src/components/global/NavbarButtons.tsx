/* eslint-disable @typescript-eslint/naming-convention */

"use client";

import { useEffect } from "react";
import getUserSession from "@/actions/getUserSession";
import useAuthStore from "@/stores/authStore";
import { useQuery } from "@tanstack/react-query";

import { Button } from "./Button";
import UserAvatar from "./UserAvatar";

function NavbarButtons() {
  const { setAuthData, userData } = useAuthStore();

  const { data: session, isLoading } = useQuery({
    queryKey: ["userSession"],
    queryFn: getUserSession,
  });

  useEffect(() => {
    if (session) {
      const { id, email, picture, family_name, given_name } = session.user;
      const { userId } = session;
      const username = `${given_name} ${family_name}`;

      localStorage.setItem(
        "user",
        JSON.stringify({ id, email, picture, username, userId })
      );
      setAuthData({ id, email, picture, username, userId });
    }
  }, [session, setAuthData]);

  return (
    <>
      {session?.user && userData ? (
        <div className="flex gap-4">
          <Button href="/dashboard" size="md">
            Dashboard
          </Button>
          <Button
            href="/api/auth/logout"
            size="md"
            variant="secondary"
            onClick={() => localStorage.removeItem("user")}
          >
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
