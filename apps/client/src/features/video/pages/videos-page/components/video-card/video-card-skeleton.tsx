import { Skeleton } from "@/components/ui";

export function VideoCardSkeleton() {
  return (
    <div className="group border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
      {/* Video Thumbnail Skeleton */}
      <div className="relative">
        <Skeleton className="aspect-video w-full" />

        {/* Duration Badge Skeleton */}
        <div className="absolute bottom-2 right-2">
          <Skeleton className="h-5 w-12 rounded-sm" />
        </div>
      </div>

      {/* Card Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Avatar and Title Section */}
        <div className="flex items-start gap-3">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-6 w-6 rounded" />
        </div>

        {/* Description Skeleton */}
        <div className="space-y-1">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>

        {/* Tags Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-18 rounded-full" />
        </div>

        {/* Stats Section Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-8" />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Skeleton className="h-3 w-3" />
              <Skeleton className="h-3 w-6" />
              <Skeleton className="h-3 w-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
