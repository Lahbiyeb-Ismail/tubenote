import DashboardHeader from "@/components/dashboards/DashboardHeader";
import UserStats from "@/components/dashboards/UserStats";
import RecentUserActions from "@/components/dashboards/RecentUserActions";

function DashboardPage() {
	return (
		<div className="flex-grow p-8">
			<DashboardHeader />
			<UserStats />
			{/* <div className="w-[90%] bg-slate-400 h-[1px] mx-auto" /> */}
			<RecentUserActions />
		</div>
	);
}

export default DashboardPage;
