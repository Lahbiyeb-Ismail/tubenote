import React from "react";

import Sidebar from "@/components/global/Sidebar";

type LayoutProps = {
  children: React.ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="w-full">{children}</div>
    </div>
  );
}

export default Layout;
