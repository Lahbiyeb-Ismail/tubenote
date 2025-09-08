import { Zap } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

import { useDashboardStudyStreakQuery } from "../queries";

export function StudyStreak() {
  const {
    data: studyStreak,
    isLoading,
    error,
  } = useDashboardStudyStreakQuery();

  // Get motivational message based on streak
  const getMotivationalMessage = (current: number, longest: number): string => {
    if (current === 0) {
      return "Start your streak today! 💪";
    }
    else if (current >= longest) {
      return "New personal best! Keep it up! 🏆";
    }
    else if (current >= 30) {
      return "Amazing streak! You're unstoppable! 🚀";
    }
    else if (current >= 14) {
      return "Two weeks strong! Keep going! 🔥";
    }
    else if (current >= 7) {
      return "One week streak! You're on fire! 🔥";
    }
    else if (current >= 3) {
      return "Great start! Keep the momentum! 💪";
    }
    else {
      return "Keep it up! You're building momentum! 💫";
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            Study Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="text-center mb-4">
              <div className="h-10 w-16 bg-slate-200 dark:bg-slate-700 rounded mx-auto mb-2" />
              <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded mx-auto" />
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {Array.from({ length: 14 }).map((_, index) => (
                <div
                  key={index}
                  className="h-6 w-6 bg-slate-200 dark:bg-slate-700 rounded-sm"
                />
              ))}
            </div>
            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded mx-auto" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            Study Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-600 dark:text-slate-400">
            Failed to load streak data
          </div>
        </CardContent>
      </Card>
    );
  }

  // No data state
  if (!studyStreak) {
    return (
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            Study Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-600 dark:text-slate-400">
            No streak data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-500" />
          Study Streak
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
            {studyStreak.currentStreak}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {studyStreak.currentStreak === 1 ? "Day" : "Days"}
            {" "}
            in a row
          </div>
          {studyStreak.longestStreak > studyStreak.currentStreak && (
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Best:
              {" "}
              {studyStreak.longestStreak}
              {" "}
              days
            </div>
          )}
        </div>

        {/* Streak visualization - show last 14 days */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {studyStreak.streakData.map(day => (
            <div
              key={`${day.date}-${day.day}`}
              className={`h-6 w-6 rounded-sm ${
                day.active
                  ? "bg-amber-500 dark:bg-amber-400"
                  : "bg-slate-200 dark:bg-slate-700"
              }`}
              title={`${day.date}: ${day.active ? "Active" : "No activity"}`}
            />
          ))}
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
          {getMotivationalMessage(studyStreak.currentStreak, studyStreak.longestStreak)}
        </p>
      </CardContent>
    </Card>
  );
}
