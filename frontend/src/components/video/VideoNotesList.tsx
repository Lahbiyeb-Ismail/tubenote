import type { Note } from "@/types/note.types";
import VideoNote from "./VideoNote";

type VideoNotesListProps = {
	notes: Note[];
};

function VideoNotesList({ notes }: VideoNotesListProps) {
	return (
		<div className="md:px-4 py-6">
			{notes.map((note) => (
				<VideoNote key={note.id} note={note} />
			))}
		</div>
	);
}

export default VideoNotesList;
