"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboards/Sidebar";
import withAuth from "@/HOC/withAuth";

type LayoutProps = {
	children: React.ReactNode;
};

function Layout({ children }: LayoutProps) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

	return (
		<div className="flex bg-gray-100 overflow-hidden">
			<Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
			<div
				className={`flex-1 bg-gray-100 p-4 overflow-auto transition-all duration-300
					${isSidebarOpen ? "ml-64" : "ml-20"}`}
			>
				{children}
			</div>
		</div>
	);
}

export default withAuth(Layout);
