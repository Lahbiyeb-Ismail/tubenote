"use client";

import AddNoteForm from "@/components/dashboards/AddNoteForm";
import Header from "@/components/dashboards/Header";
import NotesList from "@/components/note/NotesList";
import { useNote } from "@/context/useNote";
import useGetUserNotes from "@/hooks/useGetUserNotes";

function NotesPage() {
	// const { notes, isNotesLoading } = useNote();

	const { data, isLoading } = useGetUserNotes();

	return (
		<div className="min-h-screen flex-1 bg-gray-100">
			<Header title="Your Video Notes" />
			<main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
				{!data && !isLoading ? (
					<p className="text-center">No notes found.</p>
				) : (
					<>
						<div className="flex justify-end">
							<AddNoteForm />
						</div>
						<NotesList notes={data} />
					</>
				)}
			</main>
		</div>
	);
}

export default NotesPage;
