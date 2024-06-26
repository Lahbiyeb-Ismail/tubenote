import React from "react";

function DashboardPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Dashboard - TubeNote</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* User Settings */}
        <div className="rounded-lg bg-white p-4 shadow-md">
          <h2 className="mb-2 text-xl font-semibold">User Settings</h2>
          <p>User settings content goes here</p>
        </div>
        {/* Notes */}
        <div className="col-span-1 rounded-lg bg-white p-4 shadow-md md:col-span-2">
          <h2 className="mb-2 text-xl font-semibold">Notes</h2>
          <p>Notes content goes here</p>
        </div>
        {/* Videos */}
        <div className="col-span-1 rounded-lg bg-white p-4 shadow-md md:col-span-3">
          <h2 className="mb-2 text-xl font-semibold">Videos</h2>
          <p>Videos content goes here</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
