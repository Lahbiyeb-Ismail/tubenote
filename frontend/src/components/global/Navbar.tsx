/* eslint-disable @typescript-eslint/naming-convention */

"use client";

import React, { useEffect } from "react";
import useAuthStore from "@/stores/authStore";

import { Button } from "./Button";
import MaxWidthWrapper from "./MaxWidthWrapper";
import TubeNoteLogo from "./TubenoteLogo";

function Navbar() {
  const { setAuthData, userData } = useAuthStore();

  useEffect(() => {
    async function getUserSession() {
      const res = await fetch("/api/auth/user_session");
      const { user, authenticated } = await res.json();

      if (authenticated && user) {
        const { id, email, picture, family_name, given_name } = user;
        const username = `${given_name} ${family_name}`;
        setAuthData({ id, email, picture, username });
      }
    }

    getUserSession();
  }, [setAuthData]);

  return (
    <header className="sticky inset-x-0 top-0 z-[100] h-14 w-full backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <nav className="flex h-14 items-center justify-between">
          <TubeNoteLogo />

          {userData ? (
            <div>
              <Button href="/dashboard" size="md" className="mr-3">
                Dashboard
              </Button>
              <Button href="/api/auth/logout" size="md" variant="secondary">
                Logout
              </Button>
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
