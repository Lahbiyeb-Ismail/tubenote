import { Award, Bookmark, FileText, Video } from "lucide-react";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

import { useDashboardRecentActivitiesQuery } from "../queries";

// Icon mapping for different activity types
function getActivityIcon(type: string) {
  switch (type.toLowerCase()) {
    case "note_created":
    case "note_updated":
      return FileText;
    case "video_watched":
    case "video_completed":
      return Video;
    case "bookmark_added":
    case "bookmark_removed":
      return Bookmark;
    case "achievement_unlocked":
    case "streak_milestone":
      return Award;
    default:
      return FileText;
  }
}

// Color mapping for different activity types
function getActivityColor(type: string) {
  switch (type.toLowerCase()) {
    case "note_created":
    case "note_updated":
      return "blue";
    case "video_watched":
    case "video_completed":
      return "green";
    case "bookmark_added":
    case "bookmark_removed":
      return "purple";
    case "achievement_unlocked":
    case "streak_milestone":
      return "amber";
    default:
      return "blue";
  }
}

// Format relative time
// function formatRelativeTime(dateString: string): string {
//   const date = new Date(dateString);
//   const now = new Date();
//   const diffInMs = now.getTime() - date.getTime();

//   const minutes = Math.floor(diffInMs / (1000 * 60));
//   const hours = Math.floor(diffInMs / (1000 * 60 * 60));
//   const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

//   if (minutes < 1)
//     return "Just now";
//   if (minutes < 60)
//     return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
//   if (hours < 24)
//     return `${hours} hour${hours === 1 ? "" : "s"} ago`;
//   if (days < 7)
//     return `${days} day${days === 1 ? "" : "s"} ago`;
//   if (days < 30) {
//     const weeks = Math.floor(days / 7);
//     return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
//   }

//   return date.toLocaleDateString();
// }

export function RecentActivity() {
  const {
    data: recentActivities,
    isLoading,
    error,
  } = useDashboardRecentActivitiesQuery();

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
        {isLoading
          ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="animate-pulse flex items-center gap-3 p-3">
                    <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-1" />
                      <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            )
          : error
            ? (
                <div className="text-center py-8 text-slate-600 dark:text-slate-400">
                  Failed to load recent activities
                </div>
              )
            : !recentActivities || recentActivities.length === 0
                ? (
                    <div className="text-center py-8 text-slate-600 dark:text-slate-400">
                      No recent activities found
                    </div>
                  )
                : (
                    <div className="space-y-4">
                      {recentActivities.map((activity) => {
                        const Icon = getActivityIcon(activity.type);
                        const color = getActivityColor(activity.type);

                        return (
                          <div
                            key={`${activity.id}`}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                          >
                            <div
                              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                color === "blue"
                                  ? "bg-blue-100 dark:bg-blue-900/30"
                                  : color === "green"
                                    ? "bg-green-100 dark:bg-green-900/30"
                                    : color === "purple"
                                      ? "bg-purple-100 dark:bg-purple-900/30"
                                      : "bg-amber-100 dark:bg-amber-900/30"
                              }`}
                            >
                              <Icon
                                className={`h-4 w-4 ${
                                  color === "blue"
                                    ? "text-blue-600 dark:text-blue-400"
                                    : color === "green"
                                      ? "text-green-600 dark:text-green-400"
                                      : color === "purple"
                                        ? "text-purple-600 dark:text-purple-400"
                                        : "text-amber-600 dark:text-amber-400"
                                }`}
                              />
                            </div>
                            {/* <div className="flex-1">
                              <p className="text-sm font-medium">{activity.description}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {formatRelativeTime(activity.createdAt)}
                              </p>
                            </div> */}
                          </div>
                        );
                      })}
                    </div>
                  )}
      </CardContent>
    </Card>
  );
}
