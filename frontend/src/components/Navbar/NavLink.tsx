import type React from "react";
import Link from "next/link";

type NavLinkProps = {
	name: string;
	href: string;
	pathname: string;
	icon: React.ElementType;
};

function NavLink({ name, href, icon: Icon, pathname }: NavLinkProps) {
	return (
		<Link
			href={href}
			className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
				pathname === href
					? "bg-red-50 text-red-600"
					: "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
			}`}
		>
			<Icon className="mr-2 h-5 w-5" />
			{name}
		</Link>
	);
}

export default NavLink;
