import Link from "next/link";
import {
	FileText,
	LayoutDashboard,
	LogOut,
	Settings,
	Video,
} from "lucide-react";

import { useAuth } from "@/context/useAuth";

import UserAvatar from "../global/UserAvatar";

import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

function DropDownNavbar() {
	const { state, logout } = useAuth();
	const { user } = state;

	return (
		<div className="flex items-center">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="relative h-8 w-8 rounded-full">
						<UserAvatar />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
					<DropdownMenuLabel className="font-normal">
						<div className="flex flex-col space-y-1">
							<p className="text-sm font-medium leading-none">
								{user?.username}
							</p>
							<p className="text-xs leading-none text-muted-foreground">
								{user?.email}
							</p>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator className="block md:hidden" />
					<Link href="/dashboard">
						<DropdownMenuItem className="flex items-center cursor-pointer md:hidden">
							<LayoutDashboard className="mr-2 h-4 w-4" />
							<span>Dashboard</span>
						</DropdownMenuItem>
					</Link>
					<Link href="/notes">
						<DropdownMenuItem className="flex items-center cursor-pointer md:hidden">
							<FileText className="mr-2 h-4 w-4" />
							<span>Notes</span>
						</DropdownMenuItem>
					</Link>
					<Link href="/videos">
						<DropdownMenuItem className="flex items-center cursor-pointer md:hidden">
							<Video className="mr-2 h-4 w-4" />
							<span>Videos</span>
						</DropdownMenuItem>
					</Link>
					<DropdownMenuSeparator />
					{/* <DropdownMenuItem className="flex items-center cursor-pointer">
						<User className="mr-2 h-4 w-4" />
						<span>Profile</span>
					</DropdownMenuItem> */}
					<Link href="/settings">
						<DropdownMenuItem className="flex items-center cursor-pointer">
							<Settings className="mr-2 h-4 w-4" />
							<span>Settings</span>
						</DropdownMenuItem>
					</Link>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="flex items-center cursor-pointer text-red-600 
					focus:text-red-600 focus:bg-red-50"
						onClick={() => logout()}
					>
						<LogOut className="mr-2 h-4 w-4" />
						<span>Log out</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

export default DropDownNavbar;
