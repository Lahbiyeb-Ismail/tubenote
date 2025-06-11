import { BookOpen, LayoutDashboard, Search, User, Video } from "lucide-react";

import { NavigationHeader, UserProfileMenu } from "@/components";
import { Input } from "@/components/ui";

const dashboardNavLinks = [{
  href: "/dashboard",
  label: "Dashboard",
  icon: LayoutDashboard,
}, {
  href: "/videos",
  label: "Videos",
  icon: Video,
}, {
  href: "/notes",
  label: "Notes",
  icon: BookOpen,
}, {
  href: "/profile",
  label: "Profile",
  icon: User,
}];

export function DashboardHeader() {
  return (
    <NavigationHeader navLinks={dashboardNavLinks}>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search videos, notes..." className="pl-10 w-64" />
        </div>
        <UserProfileMenu />
      </div>
    </NavigationHeader>
  );
}
