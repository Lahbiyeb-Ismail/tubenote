"use client";

import Header from "@/components/dashboards/Header";
import NoDataFound from "@/components/dashboards/NoDataFound";
import RecentNoteList from "@/components/dashboards/RecentNotesList";

import useGetRecentNotes from "@/hooks/note/useGetRecentNotes";
import useGetRecentlyUpdatedNotes from "@/hooks/note/useGetRecentlyUpdatedNotes";

function DashboardPage() {
	const { data: recentNotes } = useGetRecentNotes();
	const { data: recentlyUpdatedNotes } = useGetRecentlyUpdatedNotes();

	return (
		<div className="min-h-screen flex-grow p-4 md:p-8">
			<Header title="Dashboard" />
			{!recentNotes || recentNotes.length === 0 ? (
				<NoDataFound title="You don't have any notes yet." />
			) : (
				<div className="mt-8 grid gap-6 md:grid-cols-2">
					<RecentNoteList
						title="Recent Notes"
						notes={recentNotes}
						emptyMessage=""
					/>
					<RecentNoteList
						title="Recently Updated Notes"
						notes={recentlyUpdatedNotes}
						emptyMessage=""
					/>
				</div>
			)}
		</div>
	);
}

export default DashboardPage;
