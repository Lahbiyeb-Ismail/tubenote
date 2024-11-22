import { useAuth } from "@/context/useAuth";
import { useLayout } from "@/context/useLayout";
import { LogOut } from "lucide-react";

function LogoutButton() {
	const { isSidebarOpen } = useLayout();
	const { logout } = useAuth();

	return (
		<li className="rounded-lg p-2 transition duration-150 ease-in-out text-gray-600 hover:bg-gray-100">
			<button
				type="button"
				onClick={() => logout()}
				className={`flex items-center ${isSidebarOpen ? "" : "justify-center"} h-full w-full text-left`}
			>
				<div
					className={`flex items-center justify-center ${
						isSidebarOpen ? "mr-3" : "w-full h-full"
					}`}
				>
					<LogOut
						className={`transition-all duration-300 ${isSidebarOpen ? "" : "w-6 h-6"}`}
					/>
				</div>
				{isSidebarOpen && <span>Logout</span>}
			</button>
		</li>
	);
}

export default LogoutButton;
