"use client";

import UserStats from "@/components/dashboards/UserStats";
import RecentNotes from "@/components/dashboards/RecentNotes";
import Header from "@/components/dashboards/Header";
import RecentlyUpdatedNotes from "@/components/dashboards/RecentlyUpdatedNotes";

function DashboardPage() {
	return (
		<div className="min-h-screen flex-grow p-4 md:p-8">
			<Header title="Dashboard" />
			<div className="mt-8 grid gap-6 md:grid-cols-2">
				<UserStats />
				<RecentNotes />
				<RecentlyUpdatedNotes />
			</div>
		</div>
	);
}

export default DashboardPage;
