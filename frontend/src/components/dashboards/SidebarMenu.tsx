import { sidebarMenuLinks } from "@/utils/constants";
import Link from "next/link";

type SidebarNavProps = {
	pathName: string;
};

function SidebarMenu({ pathName }: SidebarNavProps) {
	return (
		<nav className="flex-grow px-4">
			<ul className="space-y-2">
				{sidebarMenuLinks.map((item) => (
					<li
						key={item.name}
						className={`rounded-lg p-2 transition duration-150 ease-in-out ${item.href === pathName ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}
					>
						<Link href={item.href} className="flex items-center">
							<item.icon className="mr-3" />
							{item.name}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}

export default SidebarMenu;
