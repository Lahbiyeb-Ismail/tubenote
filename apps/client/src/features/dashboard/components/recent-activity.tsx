import { Award, Bookmark, FileText, Video } from "lucide-react";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

const recentActivities = [
  {
    type: "note",
    title: "Added note to 'React Hooks Explained'",
    time: "2 hours ago",
    icon: FileText,
    color: "blue",
  },
  {
    type: "video",
    title: "Watched 'Advanced TypeScript Patterns'",
    time: "4 hours ago",
    icon: Video,
    color: "green",
  },
  {
    type: "bookmark",
    title: "Bookmarked 'CSS Grid Masterclass'",
    time: "1 day ago",
    icon: Bookmark,
    color: "purple",
  },
  {
    type: "note",
    title: "Added note to 'Node.js Best Practices'",
    time: "2 days ago",
    icon: FileText,
    color: "blue",
  },
  {
    type: "achievement",
    title: "Earned 'Note Taker' badge",
    time: "3 days ago",
    icon: Award,
    color: "amber",
  },
];

export function RecentActivity() {
  return (
    <Card className="lg:col-span-2 border-slate-200 dark:border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map(activity => (
            <div
              key={activity.title}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  activity.color === "blue"
                    ? "bg-blue-100 dark:bg-blue-900/30"
                    : activity.color === "green"
                      ? "bg-green-100 dark:bg-green-900/30"
                      : activity.color === "purple"
                        ? "bg-purple-100 dark:bg-purple-900/30"
                        : "bg-amber-100 dark:bg-amber-900/30"
                }`}
              >
                <activity.icon
                  className={`h-4 w-4 ${
                    activity.color === "blue"
                      ? "text-blue-600 dark:text-blue-400"
                      : activity.color === "green"
                        ? "text-green-600 dark:text-green-400"
                        : activity.color === "purple"
                          ? "text-purple-600 dark:text-purple-400"
                          : "text-amber-600 dark:text-amber-400"
                  }`}
                />
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
