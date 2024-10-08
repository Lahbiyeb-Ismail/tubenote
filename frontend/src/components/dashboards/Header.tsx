import React from "react";

function Header({ title }: { title: string }) {
	return (
		<header className="flex items-center justify-between bg-white px-4 py-6 shadow sm:px-6 lg:px-8">
			<h1 className="text-3xl font-bold text-gray-900">{title}</h1>
		</header>
	);
}

export default Header;
