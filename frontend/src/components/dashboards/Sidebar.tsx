"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

import UserProfile from "../global/UserProfile";
import SidebarLogo from "./SidebarLogo";
import SidebarNav from "./SidebarMenu";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Sidebar() {
	const pathname = usePathname();

	const [isOpen, setIsOpen] = useState(true);

	const toggleSidebar = () => setIsOpen(!isOpen);

	return (
		<div
			className={`fixed left-0 top-0 flex h-full flex-col pb-6 pt-16 bg-white p-2 shadow-lg transition-all duration-300 ${isOpen ? "w-64" : "w-20"}`}
		>
			<div className="flex items-center justify-between mb-6">
				<SidebarLogo isOpen={isOpen} />
				<Button variant="ghost" size="icon" onClick={toggleSidebar}>
					{isOpen ? <ChevronLeft /> : <ChevronRight />}
				</Button>
			</div>
			<SidebarNav isOpen={isOpen} pathname={pathname} />
			<UserProfile isOpen={isOpen} />
		</div>
	);
}

export default Sidebar;
