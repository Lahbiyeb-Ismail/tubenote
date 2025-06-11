import { BookOpen, LayoutDashboard, User, Video } from "lucide-react";

import { NavLink } from "@/components";

export function DashboardNavLinks() {
  return (
    <nav className="hidden md:flex items-center gap-6 ml-8">
      <NavLink href="/dashboard">
        <LayoutDashboard className="h-4 w-4" />
        Dashboard
      </NavLink>
      <NavLink href="/videos">
        <Video className="h-4 w-4" />
        Videos
      </NavLink>
      <NavLink href="/notes">
        <BookOpen className="h-4 w-4" />
        Notes
      </NavLink>
      <NavLink href="/profile">
        <User className="h-4 w-4" />
        Profile
      </NavLink>
    </nav>
  );
}
