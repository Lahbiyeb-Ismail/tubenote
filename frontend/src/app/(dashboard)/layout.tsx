"use client";

import withAuth from "@/HOC/withAuth";
import { useLayout } from "@/context/useLayout";
import Sidebar from "@/components/dashboards/Sidebar";

type LayoutProps = {
	children: React.ReactNode;
};

function Layout({ children }: LayoutProps) {
	const { isSidebarOpen } = useLayout();

	return (
		<div className="flex bg-gray-100 overflow-hidden">
			<Sidebar />
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
