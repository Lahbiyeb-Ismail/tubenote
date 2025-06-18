"use client";

import { DashboardNavigationHeader } from "@/features/dashboard/components";
import { NoteCreationDialog } from "@/features/note/components";

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <DashboardNavigationHeader />
      {children}
      <NoteCreationDialog />
    </div>
  );
}

export default Layout;
