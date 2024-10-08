function DashboardHeader() {
	return (
		<header className="mb-8 flex items-center justify-between rounded-lg bg-white p-4 shadow">
			<div className="relative mr-4 max-w-md flex-grow">
				<input
					type="search"
					placeholder="Search"
					className="w-full rounded-full border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-300"
				/>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="absolute left-3 top-1/2 size-5 -translate-y-1/2 transform text-gray-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<title>Search Icon</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</div>

			<div className="flex items-center space-x-4">
				<div className="relative">
					<select className="appearance-none bg-transparent py-2 pr-8 font-medium text-gray-600 focus:outline-none">
						<option>Monday, 6th March</option>
					</select>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="absolute right-0 top-1/2 size-5 -translate-y-1/2 transform text-gray-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<title>Dropdown arrow</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				</div>

				<div className="flex rounded-lg bg-gray-100 p-1">
					<button
						type="button"
						className="rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm transition duration-150 ease-in-out hover:bg-blue-700"
					>
						Card
					</button>
					<button
						type="button"
						className="rounded-md px-4 py-2 text-gray-600 transition duration-150 ease-in-out hover:bg-gray-200"
					>
						List
					</button>
				</div>
			</div>
		</header>
	);
}

export default DashboardHeader;
