import AddNoteForm from "@/components/dashboards/AddNoteForm";
import Header from "@/components/dashboards/Header";

function NotesPage() {
	return (
		<div className="min-h-screen flex-1 bg-gray-100">
			<Header title="Your Video Notes" />
			<main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
				<div className="flex justify-end">
					<AddNoteForm />
				</div>
			</main>
		</div>
	);
}

export default NotesPage;
