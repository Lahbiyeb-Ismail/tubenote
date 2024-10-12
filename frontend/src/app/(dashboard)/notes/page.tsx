"use client";

import AddNoteForm from "@/components/dashboards/AddNoteForm";
import Header from "@/components/dashboards/Header";
import NotesList from "@/components/note/NotesList";
import { useNote } from "@/context/useNote";

function NotesPage() {
	const { notes, isNotesLoading } = useNote();

	return (
		<div className="min-h-screen flex-1 bg-gray-100">
			<Header title="Your Video Notes" />
			<main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
				{!notes && !isNotesLoading ? (
					<p className="text-center">No notes found.</p>
				) : (
					<>
						<div className="flex justify-end">
							<AddNoteForm />
						</div>
						<NotesList notes={notes} />
					</>
				)}
			</main>
		</div>
	);
}

export default NotesPage;
