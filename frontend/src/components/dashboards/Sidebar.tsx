"use client";

import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useLayout } from "@/context/useLayout";

import Link from "next/link";
import LogoutButton from "../auth/LogoutButton";
import UserProfile from "../global/UserProfile";
import SidebarLogo from "./SidebarLogo";
import SidebarNav from "./SidebarNav";

function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar } = useLayout();

  return (
    <aside
      className={`fixed left-0 top-0 flex h-full flex-col py-6  bg-white p-2 shadow-lg
				transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-20"}`}
    >
      <div className="flex items-center justify-between mb-6">
        <Link href="/">
          <SidebarLogo isOpen={isSidebarOpen} />
        </Link>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <ChevronRight
            className={`transition-transform duration-300 ${isSidebarOpen ? "rotate-180" : ""}`}
          />
        </Button>
      </div>
      <SidebarNav isOpen={isSidebarOpen} pathname={pathname} />
      <ul
        className={`mt-auto border-t pt-3 space-y-2 transition-all duration-300 ${
          isSidebarOpen ? "px-4" : "px-0"
        }`}
      >
        <LogoutButton />
        <UserProfile isOpen={isSidebarOpen} />
      </ul>
    </aside>
  );
}

export default Sidebar;
