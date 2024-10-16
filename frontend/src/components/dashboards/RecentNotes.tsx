import type { INote } from "@/types/note.types";
import NoteCard from "../note/NoteCard";

function RecentNotes() {
	const recentNotes: INote[] = [
		{
			id: "1",
			title: "Meeting notes",
			videoTitle: "Team Sync Meeting",
			content:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien",
			createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
			thumbnail: "/images/meeting.jpg",
		},
		{
			id: "2",
			title: "Project ideas",
			videoTitle: "Brainstorming Session",
			content:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien",
			createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
			thumbnail: "/images/project.jpg",
		},
	];

	return (
		<div className="bg-white rounded-lg shadow-md p-6">
			<h2 className="text-xl font-semibold mb-4">Recent Notes</h2>
			<div className="space-y-4">
				{recentNotes.map((note) => (
					<NoteCard key={note.id} note={note} />
				))}
			</div>
		</div>
	);
}

export default RecentNotes;
