"use client";

import Header from "@/components/dashboards/Header";
import RecentNoteList from "@/components/dashboards/RecentNotesList";

import useGetRecentNotes from "@/hooks/useGetRecentNotes";
import useGetRecentlyUpdatedNotes from "@/hooks/useGetRecentlyUpdatedNotes";

function DashboardPage() {
	const { data: recentNotes } = useGetRecentNotes();
	const { data: recentlyUpdatedNotes } = useGetRecentlyUpdatedNotes();

	return (
		<div className="min-h-screen flex-grow p-4 md:p-8">
			<Header title="Dashboard" />
			<div className="mt-8 grid gap-6 md:grid-cols-2">
				{/* <UserStats /> */}
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
		</div>
	);
}

export default DashboardPage;
