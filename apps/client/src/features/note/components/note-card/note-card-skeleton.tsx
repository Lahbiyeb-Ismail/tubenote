import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function NoteCardSkeleton() {
  return (
    <Card className="group">
      {/* Header Section Skeleton */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="flex-1 min-w-0">
              {/* Title Skeleton */}
              <div className="space-y-2 mb-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
              </div>

              {/* Category and Timestamp Skeleton */}
              <div className="flex items-center gap-2 mt-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <div className="flex items-center gap-1">
                  <Skeleton className="h-3 w-3" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </div>
          </div>

          {/* Actions Menu Skeleton */}
          <Skeleton className="h-6 w-6" />
        </div>
      </CardHeader>

      {/* Content Section Skeleton */}
      <CardContent>
        {/* Content Preview Skeleton */}
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="space-y-3">
          {/* Video Title Section Skeleton */}
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 flex-1" />
          </div>

          {/* Tags Skeleton */}
          <div className="flex flex-wrap gap-1">
            <Skeleton className="h-5 w-12 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-10 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>

          {/* Footer with Created Date and Actions Skeleton */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-24" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-16 rounded" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
