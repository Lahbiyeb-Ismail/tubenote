import { BookOpen, Eye } from "lucide-react";

import { formatVideoViewsCount } from "@/features/video/helpers";

interface IProps {
  viewsCount: string;
  notesCount: number;
}

export function VideoCardStatistics({ viewsCount, notesCount }: IProps) {
  return (
    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
      <div className="flex items-center gap-1 text-xs text-slate-500">
        <Eye className="h-3 w-3" />
        {formatVideoViewsCount(viewsCount)}
      </div>
      <div className="flex items-center gap-3">
        {notesCount > 0
          ? (
              <div className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {notesCount}
                {" "}
                notes
              </div>
            )
          : (
              <div className="text-slate-400">No notes</div>
            )}
      </div>
    </div>
  );
}
