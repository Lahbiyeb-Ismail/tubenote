"use client";

import React from "react";
import { usePathname } from "next/navigation";

import SidebarLogo from "./SidebarLogo";
import SidebarNav from "./SidebarNav";
import UserProfile from "./UserProfile";

function Sidebar() {
  const pathName = usePathname();

  return (
    <div className="flex w-64 flex-col bg-white p-6">
      <SidebarLogo />
      <SidebarNav pathName={pathName} />
      <UserProfile />
    </div>
  );
}

export default Sidebar;
