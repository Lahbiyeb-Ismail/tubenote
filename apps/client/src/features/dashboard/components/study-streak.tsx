import { Zap } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

const studyStreakData = [
  { day: 1, active: true },
  { day: 2, active: true },
  { day: 3, active: true },
  { day: 4, active: true },
  { day: 5, active: true },
  { day: 6, active: false },
  { day: 7, active: true },
  { day: 8, active: true },
  { day: 9, active: true },
  { day: 10, active: true },
  { day: 11, active: true },
  { day: 12, active: true },
  { day: 13, active: true },
  { day: 14, active: true },
];

export function StudyStreak() {
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
          <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">12</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Days in a row</div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {studyStreakData.map(day => (
            <div
              key={day.day}
              className={`h-6 w-6 rounded-sm ${
                day.active ? "bg-amber-500 dark:bg-amber-400" : "bg-slate-200 dark:bg-slate-700"
              }`}
              title={`Day ${day.day}`}
            />
          ))}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
          Keep it up! You're on fire 🔥
        </p>
      </CardContent>
    </Card>
  );
}
