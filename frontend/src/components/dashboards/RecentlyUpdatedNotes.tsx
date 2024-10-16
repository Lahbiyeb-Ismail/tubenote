import type { INote } from "@/types/note.types";
import NoteCard from "../note/NoteCard";

function RecentlyUpdatedNotes() {
	const recentlyUpdatedNotes: INote[] = [
		{
			id: "3",
			title: "Project timeline",
			videoTitle: "Project Planning",
			content:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien",
			createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
			thumbnail: "/images/timeline.jpg",
		},
		{
			id: "4",
			title: "Client feedback",
			videoTitle: "Client Meeting",
			content:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien",
			createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
			thumbnail: "/images/feedback.jpg",
		},
	];

	return (
		<div className="bg-white rounded-lg shadow-md p-6">
			<h2 className="text-xl font-semibold mb-4">Recently Updated Notes</h2>
			<div className="space-y-4">
				{recentlyUpdatedNotes.map((note) => (
					<NoteCard key={note.id} note={note} />
				))}
			</div>
		</div>
	);
}

export default RecentlyUpdatedNotes;
