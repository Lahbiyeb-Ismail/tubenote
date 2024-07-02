import React from "react";

import { Button } from "./Button";

// type LoggedOutButtonsProps = {
//   isLoading: boolean;
// };

function LoggedOutButtons() {
  return (
    <Button href="/api/auth/login" size="md">
      Get Started
    </Button>
  );
}

export default LoggedOutButtons;
