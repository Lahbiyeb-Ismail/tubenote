import { FileVideoIcon, NotebookPenIcon } from "lucide-react";

function RecentUserActions() {
	return (
		<div className="mb-8 rounded-lg bg-white p-6 shadow">
			<h2 className="mb-4 text-2xl font-bold">Recent Actions</h2>
			<ul className="space-y-4 flex justify-between items-center">
				<li className="flex items-center">
					<span className="mr-4 rounded-full bg-blue-100 p-2">
						<NotebookPenIcon />
					</span>
					<div>
						<p className="font-semibold">Created a new note</p>
						<p className="text-sm text-gray-500">2 hours ago</p>
					</div>
				</li>
				<li className="flex items-center">
					<span className="mr-4 rounded-full bg-purple-100 p-2">
						<FileVideoIcon />
					</span>
					<div>
						<p className="font-semibold">Uploaded a new video</p>
						<p className="text-sm text-gray-500">Yesterday</p>
					</div>
				</li>
			</ul>
		</div>
	);
}

export default RecentUserActions;
