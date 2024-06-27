import React from "react";

function Header() {
  return (
    <header className="mb-8 flex items-center justify-between rounded-lg bg-white p-4 shadow">
      <div className="relative mr-4 max-w-md flex-grow">
        <input
          type="search"
          placeholder="Search"
          className="w-full rounded-full border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-3 top-1/2 size-5 -translate-y-1/2 transform text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <select className="appearance-none bg-transparent py-2 pr-8 font-medium text-gray-600 focus:outline-none">
            <option>Monday, 6th March</option>
          </select>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute right-0 top-1/2 size-5 -translate-y-1/2 transform text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            className="rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm transition duration-150 ease-in-out hover:bg-blue-700"
          >
            Card
          </button>
          <button
            type="button"
            className="rounded-md px-4 py-2 text-gray-600 transition duration-150 ease-in-out hover:bg-gray-200"
          >
            List
          </button>
        </div>
      </div>
    </header>
  );
}

function TaskList() {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Last tasks</h2>
          <p className="text-gray-500">117 total, proceed to resolve them</p>
        </div>
        <div className="flex space-x-4">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-green-500">94</h3>
            <p className="text-gray-500">Done</p>
          </div>
          <div className="text-center">
            <h3 className="text-3xl font-bold text-blue-500">23</h3>
            <p className="text-gray-500">In progress</p>
          </div>
        </div>
      </div>
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="py-2">Name</th>
            <th className="py-2">Admin</th>
            <th className="py-2">Members</th>
            <th className="py-2">Status</th>
            <th className="py-2">Run time</th>
            <th className="py-2">Finish date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2">ClientOnboarding - Circle</td>
            <td className="py-2">Samanta J.</td>
            <td className="py-2">3</td>
            <td className="py-2">
              <span className="rounded-full bg-blue-100 px-2 py-1 text-sm text-blue-800">
                In progress
              </span>
            </td>
            <td className="py-2">6 hours</td>
            <td className="py-2">6 Mon</td>
          </tr>
          {/* Add more rows as needed */}
        </tbody>
      </table>
    </div>
  );
}

function ProductivityChart() {
  return (
    <div className="flex-1 rounded-lg bg-white p-6 shadow">
      <h3 className="mb-4 text-xl font-bold">Productivity</h3>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-gray-500">01-07 May</div>
        <div className="flex space-x-4">
          <span className="flex items-center">
            <span className="mr-2 size-3 rounded-full bg-blue-500" /> Research
          </span>
          <span className="flex items-center">
            <span className="mr-2 size-3 rounded-full bg-purple-500" /> Design
          </span>
        </div>
      </div>
      {/* You'd need to implement an actual chart here */}
      <div className="flex h-48 items-center justify-center bg-gray-100">
        Chart goes here
      </div>
    </div>
  );
}

function ProjectsInProgress() {
  return (
    <div className="flex-1 rounded-lg bg-white p-6 shadow">
      <h3 className="mb-4 text-xl font-bold">Projects in progress:</h3>
      <div className="rounded-lg bg-gray-100 p-4">
        <div className="mb-2 flex space-x-2">
          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
            Feedback
          </span>
          <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-800">
            Bug
          </span>
          <span className="rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-800">
            Design System
          </span>
        </div>
        <h4 className="mb-1 font-bold">Improve cards readability</h4>
        <p className="mb-2 text-sm text-gray-500">21.03.22</p>
        <div className="flex items-center space-x-4">
          <div className="flex -space-x-2">
            {/* Add member avatars here */}
            <div className="size-6 rounded-full bg-gray-300" />
            <div className="size-6 rounded-full bg-gray-400" />
            <div className="size-6 rounded-full bg-gray-500" />
          </div>
          <span className="text-sm text-gray-500">12 comments</span>
          <span className="text-sm text-gray-500">0 files</span>
        </div>
      </div>
    </div>
  );
}

function DashboardPage() {
  return (
    <div className="flex-grow p-8">
      <Header />
      <TaskList />
      <div className="mt-8 flex space-x-6">
        <ProductivityChart />
        <ProjectsInProgress />
      </div>
    </div>
  );
}

export default DashboardPage;
