"use client";

import { BookOpen, LayoutDashboard, User, Video } from "lucide-react";
import dynamic from "next/dynamic";

import { NavigationHeader } from "@/shared/components";

const NoteCreationDialog = dynamic(
  () => import("@/features/note/components").then(mod => mod.NoteCreationDialog),
  { ssr: false },
);

const AddVideoDialog = dynamic(
  () => import("@/features/video/components").then(mod => mod.AddVideoDialog),
  { ssr: false },
);

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const dashboardNavItems = [{
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <NavigationHeader navItems={dashboardNavItems} />
      {children}
      <NoteCreationDialog />
      <AddVideoDialog />
    </div>
  );
}
