import React from "react";
import {
  getKindeServerSession,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/server";

import { Button } from "./Button";
import MaxWidthWrapper from "./MaxWidthWrapper";
import TubeNoteLogo from "./TubenoteLogo";

async function Navbar() {
  const { getUser, isAuthenticated } = getKindeServerSession();

  const isAuth = await isAuthenticated();
  const user = await getUser();

  return (
    <header className="sticky inset-x-0 top-0 z-[100] h-14 w-full backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <nav className="flex h-14 items-center justify-between">
          <TubeNoteLogo />

          {isAuth && user ? (
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
