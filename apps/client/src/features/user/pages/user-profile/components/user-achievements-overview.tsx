import { Award, BookOpen, Calendar, Check, Clock, Edit, Star, Video } from "lucide-react";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

const achievements = [
  { name: "First Note", description: "Created your first note", icon: BookOpen, earned: true },
  { name: "Video Enthusiast", description: "Watched 50+ videos", icon: Video, earned: true },
  { name: "Note Master", description: "Created 100+ notes", icon: Edit, earned: true },
  { name: "Consistent Learner", description: "7-day study streak", icon: Calendar, earned: true },
  { name: "Speed Learner", description: "Completed 10 videos in a day", icon: Clock, earned: false },
  { name: "Knowledge Sharer", description: "Shared 5+ note collections", icon: Star, earned: false },
];

export function UserAchievementsOverview() {
  return (
    <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-600" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {achievements.slice(0, 4).map(achievement => (
            <div
              key={achievement.name}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                achievement.earned
                  ? "bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800"
                  : "bg-slate-50 dark:bg-slate-800/50"
              }`}
            >
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  achievement.earned ? "bg-amber-100 dark:bg-amber-900/30" : "bg-slate-200 dark:bg-slate-700"
                }`}
              >
                <achievement.icon
                  className={`h-4 w-4 ${
                    achievement.earned
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                />
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${achievement.earned ? "" : "text-slate-500 dark:text-slate-400"}`}
                >
                  {achievement.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{achievement.description}</p>
              </div>
              {achievement.earned && <Check className="h-4 w-4 text-amber-600 dark:text-amber-400" />}
            </div>
          ))}
          <Button variant="outline" className="w-full mt-4">
            View All Achievements
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
