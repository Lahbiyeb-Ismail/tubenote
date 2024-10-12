import NoteCard from "./NoteCard";
import type { INote } from "@/types/note.types";

type NotesListProps = {
	notes?: INote[];
};

function NotesList({ notes }: NotesListProps) {
	return (
		<div className="px-4 py-6 sm:px-0">
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{notes?.map((note) => (
					<NoteCard key={note.id} note={note} />
				))}
			</div>
		</div>
	);
}

export default NotesList;
