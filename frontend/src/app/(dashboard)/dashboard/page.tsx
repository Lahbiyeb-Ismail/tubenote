import DashboardHeader from "@/components/dashboards/DashboardHeader";
import UserStats from "@/components/dashboards/UserStats";

function DashboardPage() {
	return (
		<div className="flex-grow p-8">
			<DashboardHeader />
			<UserStats />
		</div>
	);
}

export default DashboardPage;
