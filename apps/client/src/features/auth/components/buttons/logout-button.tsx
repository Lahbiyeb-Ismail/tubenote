import { LogOut } from "lucide-react";

import { useUIStore } from "@/stores";
import { useAuth } from "../../contexts";

export function LogoutButton() {
  const { layout } = useUIStore();
  const { logoutMutationResult } = useAuth();
  const { mutate: logout, isPending } = logoutMutationResult;

  return (
    <li className="rounded-lg p-2 transition duration-150 ease-in-out text-gray-600 hover:bg-gray-100">
      <button
        type="button"
        disabled={isPending}
        onClick={() => logout()}
        className={`flex items-center ${layout.isSidebarOpen ? "" : "justify-center"} h-full w-full text-left`}
      >
        <div
          className={`flex items-center justify-center ${
            layout.isSidebarOpen ? "mr-3" : "w-full h-full"
          }`}
        >
          <LogOut
            className={`transition-all duration-300 ${layout.isSidebarOpen ? "" : "w-6 h-6"}`}
          />
        </div>
        {layout.isSidebarOpen && <span>Logout</span>}
      </button>
    </li>
  );
}
