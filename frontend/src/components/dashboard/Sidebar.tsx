"use client";

import React from "react";
import { usePathname } from "next/navigation";

import SidebarLogo from "./SidebarLogo";
import SidebarNav from "./SidebarNav";
import UserProfile from "./UserProfile";

function Sidebar() {
  const pathName = usePathname();

  return (
    <div className="fixed left-0 top-0 flex h-full w-64 flex-col bg-white px-6 pb-6 pt-16">
      <SidebarLogo />
      <SidebarNav pathName={pathName} />
      <UserProfile />
    </div>
  );
}

export default Sidebar;
