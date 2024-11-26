"use client";

import usePagination from "@/hooks/global/usePagination";
import useGetUserNotes from "@/hooks/note/useGetUserNotes";

import AddNoteForm from "@/components/dashboards/AddNoteForm";
import Header from "@/components/dashboards/Header";
import NotesList from "@/components/note/NotesList";
import Laoder from "@/components/global/Loader";
import NoDataFound from "@/components/dashboards/NoDataFound";
import PaginationComponent from "@/components/global/Pagination";

function NotesPage() {
	const { currentPage, setPage } = usePagination({
		defaultPage: 1,
	});

	const { data, isLoading } = useGetUserNotes({ page: currentPage, limit: 2 });

	if (isLoading) return <Laoder />;

	if (!data || data.notes.length === 0)
		return <NoDataFound title="You don't have any notes yet." />;

	return (
		<div className="min-h-screen flex-1 bg-gray-100">
			<Header title="Your Video Notes" />
			<main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
				<div className="flex justify-end">
					<AddNoteForm />
				</div>
				<NotesList notes={data.notes} />
				<PaginationComponent
					currentPage={currentPage}
					totalPages={data.pagination.totalPages}
					onPageChange={setPage}
				/>
			</main>
		</div>
	);
}

export default NotesPage;
