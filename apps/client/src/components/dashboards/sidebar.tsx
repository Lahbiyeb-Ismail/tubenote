"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useUIStore } from "@/stores";

import { LogoutButton } from "@/features/auth/components";
import { UserProfile } from "@/features/user/components";

import { Button } from "@/components/ui";

import { SidebarLogo, SidebarNav } from "./";

export function Sidebar() {
  const pathname = usePathname();
  const { layout, actions } = useUIStore();

  return (
    <aside
      className={`fixed left-0 top-0 flex h-full flex-col py-6  bg-white p-2 shadow-lg
				transition-all duration-300 ${layout.isSidebarOpen ? "w-64" : "w-20"}`}
    >
      <div className="flex items-center justify-between mb-6">
        <Link href="/">
          <SidebarLogo isOpen={layout.isSidebarOpen} />
        </Link>
        <Button variant="ghost" size="icon" onClick={actions.toggleSidebar}>
          <ChevronRight
            className={`transition-transform duration-300 ${layout.isSidebarOpen ? "rotate-180" : ""}`}
          />
        </Button>
      </div>
      <SidebarNav isOpen={layout.isSidebarOpen} pathname={pathname} />
      <ul
        className={`mt-auto border-t pt-3 space-y-2 transition-all duration-300 ${
          layout.isSidebarOpen ? "px-4" : "px-0"
        }`}
      >
        <LogoutButton />
        <UserProfile isOpen={layout.isSidebarOpen} />
      </ul>
    </aside>
  );
}
