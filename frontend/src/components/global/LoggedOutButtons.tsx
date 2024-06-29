import React from "react";

import { Button } from "./Button";

type LoggedOutButtonsProps = {
  isLoading: boolean;
};

function LoggedOutButtons({ isLoading }: LoggedOutButtonsProps) {
  return (
    <Button href="/api/auth/login" size="md" disabled={isLoading}>
      Get Started
    </Button>
  );
}

export default LoggedOutButtons;
