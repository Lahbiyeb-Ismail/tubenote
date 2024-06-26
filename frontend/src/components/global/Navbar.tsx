/* eslint-disable @typescript-eslint/naming-convention */

"use client";

import React, { useEffect } from "react";
import getUserSession from "@/actions/getUserSession";
import useAuthStore from "@/stores/authStore";
import { useQuery } from "@tanstack/react-query";

import { Button } from "./Button";
import MaxWidthWrapper from "./MaxWidthWrapper";
import TubeNoteLogo from "./TubenoteLogo";
import UserAvatar from "./UserAvatar";

function Navbar() {
  const { setAuthData, userData } = useAuthStore();

  const { error, data, isSuccess } = useQuery({
    queryKey: ["userData"],
    queryFn: getUserSession,
  });

  useEffect(() => {
    if (data?.user && isSuccess && !error) {
      const { id, email, picture, family_name, given_name } = data.user;
      const username = `${given_name} ${family_name}`;
      setAuthData({ id, email, picture, username });
    }
  }, [data, setAuthData, isSuccess, error]);

  return (
    <header className="sticky inset-x-0 top-0 z-[100] h-14 w-full backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <nav className="flex h-14 items-center justify-between">
          <TubeNoteLogo />

          {userData ? (
            <div className="flex gap-4">
              <Button href="/dashboard" size="md">
                Dashboard
              </Button>
              <Button href="/api/auth/logout" size="md" variant="secondary">
                Logout
              </Button>
              <UserAvatar
                imgSrc={userData.picture}
                username={userData.username}
              />
            </div>
          ) : (
            <Button href="/api/auth/login" size="md">
              Get Started
            </Button>
          )}
        </nav>
      </MaxWidthWrapper>
    </header>
  );
}

export default Navbar;
