function UserStats() {
	return (
		<div className="bg-white rounded-lg shadow-md p-6 my-8">
			<div className="flex justify-between items-center">
				<div className="text-center">
					<h2 className="text-4xl font-bold text-blue-500">156</h2>
					<p className="text-gray-600 mt-1">Notes</p>
				</div>
				<div className="w-px h-16 bg-gray-300" />
				<div className="text-center">
					<h2 className="text-4xl font-bold text-purple-500">42</h2>
					<p className="text-gray-600 mt-1">Videos</p>
				</div>
			</div>
		</div>
	);
}

export default UserStats;
