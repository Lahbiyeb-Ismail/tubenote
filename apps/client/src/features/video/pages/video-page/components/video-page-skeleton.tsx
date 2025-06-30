import { DashboardHeaderSkeleton } from "@/components/dashboards";
import { Skeleton } from "@/components/ui/skeleton";

export function VideoPageSkeleton() {
  return (
    <div className="container py-6 overflow-auto">
      {/* Page Header Skeleton */}
      <DashboardHeaderSkeleton />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
        {/* Video Notes Section Skeleton */}
        <div className="flex flex-col space-y-4 h-full">
          {/* Notes Header Skeleton */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-5 w-12" />
            </div>

            {/* Search Input Skeleton */}
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Notes List Skeleton */}
          <div className="flex-1 space-y-3 overflow-hidden">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-3">
                {/* Note Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-3/4" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-6" />
                </div>

                {/* Note Content */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-2/3" />
                </div>

                {/* Note Tags */}
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-12 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-10 rounded-full" />
                </div>

                {/* Note Footer */}
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-12 rounded" />
                    <Skeleton className="h-6 w-12 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Player Section Skeleton */}
        <div className="lg:col-span-2 flex flex-col space-y-4 relative">
          {/* Video Player Skeleton */}
          <div className="relative w-full bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
            <div className="aspect-video">
              <Skeleton className="w-full h-full" />

              {/* Play Button Skeleton */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Skeleton className="h-16 w-16 rounded-full" />
              </div>

              {/* Video Controls Skeleton */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <div className="space-y-2">
                  {/* Progress Bar Skeleton */}
                  <Skeleton className="h-1 w-full rounded" />

                  {/* Controls Skeleton */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded" />
                      <Skeleton className="h-8 w-8 rounded" />
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>

                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-8 w-8 rounded" />
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
