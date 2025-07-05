import { Award, BookOpen, Clock, Video } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export function UserStatisticsOverview() {
  return (
    <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-lg">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="h-4 w-4 text-blue-600" />
            <span className="text-sm">Videos Watched</span>
          </div>
          <span className="font-semibold">20</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-green-600" />
            <span className="text-sm">Total Notes</span>
          </div>
          <span className="font-semibold">45</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-600" />
            <span className="text-sm">Study Time</span>
          </div>
          <span className="font-semibold">120h</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-600" />
            <span className="text-sm">Achievements</span>
          </div>
          <span className="font-semibold">8</span>
        </div>
      </CardContent>
    </Card>
  );
}
