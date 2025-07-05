import {
  BookOpen,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function UserLearningProgress() {
  return (
    <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          Learning Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Weekly Goal</span>
                <span className="text-sm text-slate-500">7/10 videos</span>
              </div>
              <Progress value={70} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Note Taking</span>
                <span className="text-sm text-slate-500">15/20 notes</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Study Streak</span>
                <span className="text-sm text-slate-500">
                  7
                  {" "}
                  days
                </span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">20</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Videos Completed</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">15</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Notes</div>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">10h</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Study Time</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
