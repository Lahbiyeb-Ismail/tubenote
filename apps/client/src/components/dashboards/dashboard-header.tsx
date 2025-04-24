import { Calendar, LayoutGrid, List, Search } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="mb-8 flex items-center justify-between rounded-lg bg-white p-4 shadow">
      <Search className="text-gray-400 mr-2" />
      <input
        type="text"
        placeholder="Search"
        className="flex-grow outline-none"
      />
      <div className="flex items-center ml-4">
        <span className="text-gray-600 mr-2">Monday, 6th March</span>
        <Calendar className="text-gray-400" />
      </div>
      <div className="flex items-center ml-4">
        <button
          type="button"
          className="bg-blue-500 text-white px-3 py-1 rounded-l-md"
        >
          <LayoutGrid size={18} />
        </button>
        <button
          type="button"
          className="bg-gray-200 text-gray-600 px-3 py-1 rounded-r-md"
        >
          <List size={18} />
        </button>
      </div>
    </header>
  );
}
