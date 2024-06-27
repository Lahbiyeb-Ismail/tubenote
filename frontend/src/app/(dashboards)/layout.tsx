import React from "react";

import Sidebar from "@/components/dashboard/Sidebar";

type LayoutProps = {
  children: React.ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <div className="flex bg-gray-100">
      <Sidebar />
      {children}
    </div>
  );
}

export default Layout;
