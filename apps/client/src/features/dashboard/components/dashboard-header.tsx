import { NavigationHeader } from "@/components";

import { DashboardNavLinks } from "./dashboard-nav-links";
import { DashboardProfileMenu } from "./dashboard-profile-menu";

export function DashboardHeader() {
  return (
    <NavigationHeader
      leftNavigationLinks={DashboardNavLinks()}
      rightNavigationLinks={DashboardProfileMenu()}
    />
  );
}
