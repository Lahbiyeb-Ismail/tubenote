"use client";

import React from "react";
import { LayoutGrid, List, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

function Header({ title }: { title: string }) {
	return (
		<header className="bg-white px-4 py-6 shadow sm:px-6 lg:px-8 flex flex-row items-center justify-between gap-4">
			<h1 className="text-3xl font-bold text-gray-900">{title}</h1>
			<form className="flex w-full max-w-sm items-center space-x-2">
				<Search className="text-gray-400 mr-2" />
				<input
					type="search"
					placeholder="Search"
					className="flex-grow outline-none"
				/>
			</form>
			<div className="flex items-center ml-4 space-x-2">
				<Button
					type="button"
					aria-label="Switch to row layout"
					className="bg-blue-500 text-white px-3 py-1 rounded-l-md"
				>
					<LayoutGrid size={18} />
				</Button>
				<Button
					type="button"
					aria-label="Switch to column layout"
					className="bg-gray-200 text-gray-600 px-3 py-1 rounded-r-md"
				>
					<List size={18} />
				</Button>
			</div>
		</header>
	);
}

export default Header;
