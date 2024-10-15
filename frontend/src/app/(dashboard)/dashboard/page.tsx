import UserStats from "@/components/dashboards/UserStats";
import RecentUserActions from "@/components/dashboards/RecentUserActions";
import Header from "@/components/dashboards/Header";

function DashboardPage() {
	return (
		<div className="min-h-screen flex-grow p-8">
			<Header title="Overview" />
			<UserStats />
			<RecentUserActions />
		</div>
	);
}

export default DashboardPage;
