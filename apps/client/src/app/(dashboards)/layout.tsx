"use client";

import dynamic from "next/dynamic";

import { DashboardNavigationHeader } from "@/features/dashboard/components";

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

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <DashboardNavigationHeader />
      {children}
      <NoteCreationDialog />
      <AddVideoDialog />
    </div>
  );
}

export default Layout;
