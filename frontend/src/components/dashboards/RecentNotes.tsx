import NoteCard from "../note/NoteCard";
import useGetRecentNotes from "@/hooks/useGetRecentNotes";

function RecentNotes() {
	const { data: recentNotes } = useGetRecentNotes();

	return (
		<div className="bg-white rounded-lg shadow-md p-6">
			<h2 className="text-xl font-semibold mb-4">Recent Notes</h2>
			<div className="space-y-4">
				{recentNotes?.map((note) => (
					<NoteCard key={note.id} note={note} />
				))}
			</div>
		</div>
	);
}

export default RecentNotes;
