import Link from "next/link";
import NoteCard from "../note/NoteCard";
import useGetRecentlyUpdatedNotes from "@/hooks/useGetRecentlyUpdatedNotes";
import { Button } from "../ui/button";

function RecentlyUpdatedNotes() {
	const { data: recentlyUpdatedNotes } = useGetRecentlyUpdatedNotes();

	return (
		<div className="bg-white rounded-lg shadow-md p-6">
			<h2 className="text-xl font-semibold mb-4">Recently Updated Notes</h2>
			<div className="space-y-4">
				{recentlyUpdatedNotes?.map((note) => (
					<NoteCard key={note.id} note={note} />
				))}
			</div>
			<div className="mt-6 text-center">
				<Link href="/notes">
					<Button variant="outline">View All Notes</Button>
				</Link>
			</div>
		</div>
	);
}

export default RecentlyUpdatedNotes;
