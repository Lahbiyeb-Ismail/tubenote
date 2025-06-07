"use client";

import { DashboardHeader } from "@/features/dashboard/components";
import { withAuth } from "@/HOC";

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <DashboardHeader />
      {children}
    </div>
  );
}

export default withAuth(Layout);
