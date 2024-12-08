import { FileText, Video } from "lucide-react";

function UserStats() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Your Stats</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <FileText className="text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-500">156</p>
            <p className="text-sm text-gray-600">Notes</p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="bg-purple-100 p-3 rounded-full mr-4">
            <Video className="text-purple-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-500">42</p>
            <p className="text-sm text-gray-600">Videos</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserStats;
