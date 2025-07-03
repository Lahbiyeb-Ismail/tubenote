import {
  Award,
  Clock,
  Edit,
  Video,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const recentActivity = [
  { type: "note", title: "Added note to 'React Hooks Explained'", time: "2 hours ago" },
  { type: "video", title: "Completed 'Advanced TypeScript Patterns'", time: "5 hours ago" },
  { type: "achievement", title: "Earned 'Note Master' achievement", time: "1 day ago" },
  { type: "video", title: "Started watching 'CSS Grid Masterclass'", time: "2 days ago" },
];

export function UserRecentActivity() {
  return (
    <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-green-600" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.map(activity => (
            <div
              key={activity.title}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                {activity.type === "note" && <Edit className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                {activity.type === "video" && <Video className="h-4 w-4 text-green-600 dark:text-green-400" />}
                {activity.type === "achievement" && (
                  <Award className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
