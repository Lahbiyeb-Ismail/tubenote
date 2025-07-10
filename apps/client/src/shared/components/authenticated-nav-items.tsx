import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

import { Button } from "@/components/ui";

import { UserProfileMenu } from "./user-profile-menu";

export function AuthenticatedNavItems() {
  return (
    <Fragment>
      <Button variant="ghost" asChild>
        <Link href="/dashboard">
          <LayoutDashboard className="h-4 w-4" />
        </Link>
      </Button>

      <UserProfileMenu />
    </Fragment>
  );
}
