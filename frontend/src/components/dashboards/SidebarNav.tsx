import Link from "next/link";
import { sidebarMenuLinks } from "@/utils/constants";

type SidebarNavProps = {
	pathname: string;
	isOpen: boolean;
};

function SidebarNav({ pathname, isOpen }: SidebarNavProps) {
	return (
		<nav
			className={`flex-grow transition-all duration-300 ${
				isOpen ? "px-4" : "px-0"
			}`}
		>
			<ul className="space-y-2">
				{sidebarMenuLinks.map((item) => (
					<li
						key={item.name}
						className={`rounded-lg p-2 transition duration-150 ease-in-out ${
							item.href === pathname
								? "bg-blue-100 text-blue-600"
								: "text-gray-600 hover:bg-gray-100"
						}`}
					>
						<Link
							href={item.href}
							className={`flex items-center ${
								isOpen ? "" : "justify-center"
							} h-full`}
						>
							<div
								className={`flex items-center justify-center ${
									isOpen ? "mr-3" : "w-full h-full"
								}`}
							>
								<item.icon
									className={`transition-all duration-300 ${
										isOpen ? "" : "w-6 h-6"
									}`}
								/>
							</div>
							{isOpen && <span>{item.name}</span>}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}

export default SidebarNav;
