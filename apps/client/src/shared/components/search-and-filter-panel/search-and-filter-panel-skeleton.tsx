import { Skeleton } from "@/components/ui/skeleton";

export function SearchAndFilterPanelSkeleton() {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search Input Skeleton */}
        <div className="flex-1 max-w-md">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Filter Controls Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}
