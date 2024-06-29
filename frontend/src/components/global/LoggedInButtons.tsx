import React from "react";
import type { UserDataType } from "@/types";

import { Button } from "./Button";
import UserAvatar from "./UserAvatar";

type LoggedInButtonsProps = {
  userData: UserDataType;
};

function LoggedInButtons({ userData }: LoggedInButtonsProps) {
  return (
    <div className="flex gap-4">
      <Button href="/dashboard" size="md">
        Dashboard
      </Button>
      <Button href="/api/auth/logout" size="md" variant="secondary">
        Logout
      </Button>
      <UserAvatar imgSrc={userData.picture} username={userData.username} />
    </div>
  );
}

export default LoggedInButtons;
