import { Target } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Progress } from "@/components/ui/progress";

export function LearningGoals() {
  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Target className="h-5 w-5 text-green-500" />
          Learning Goals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Weekly Notes</span>
            <span className="text-sm text-slate-500">47/50</span>
          </div>
          <Progress value={94} className="h-2" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Study Time</span>
            <span className="text-sm text-slate-500">8.5/10h</span>
          </div>
          <Progress value={85} className="h-2" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Videos Watched</span>
            <span className="text-sm text-slate-500">4/5</span>
          </div>
          <Progress value={80} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
