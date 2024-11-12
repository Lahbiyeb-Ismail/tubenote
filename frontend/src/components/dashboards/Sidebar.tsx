"use client";

import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useLayout } from "@/context/useLayout";
import { Button } from "@/components/ui/button";

import UserProfile from "../global/UserProfile";
import SidebarLogo from "./SidebarLogo";
import SidebarNav from "./SidebarNav";
import Link from "next/link";

function Sidebar() {
	const pathname = usePathname();
	const { isSidebarOpen, toggleSidebar } = useLayout();

	return (
		<div
			className={`fixed left-0 top-0 flex h-full flex-col py-6  bg-white p-2 shadow-lg
				transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-20"}`}
		>
			<div className="flex items-center justify-between mb-6">
				<Link href="/">
					<SidebarLogo isOpen={isSidebarOpen} />
				</Link>
				<Button variant="ghost" size="icon" onClick={toggleSidebar}>
					{isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
				</Button>
			</div>
			<SidebarNav isOpen={isSidebarOpen} pathname={pathname} />
			<UserProfile isOpen={isSidebarOpen} />
		</div>
	);
}

export default Sidebar;
