"use client";

import Sidebar from "@/components/dashboards/Sidebar";

type LayoutProps = {
	children: React.ReactNode;
};

function Layout({ children }: LayoutProps) {
	return (
		<div className="flex bg-gray-100">
			<Sidebar />
			<div className="ml-64 flex-1 bg-gray-100 p-4">{children}</div>
		</div>
	);
}

export default Layout;
