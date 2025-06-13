import { Skeleton } from "@/components/ui/skeleton";

export function NotesDashboardSkeleton() {
  return (
    <main className="container py-6">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-5 w-72" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-36" />
          </div>
        </div>
      </div>

      {/* Search and Filter Skeleton */}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-3 justify-between">
          <Skeleton className="h-10 w-full md:w-72" />
          {" "}
          {/* Search input */}
          <div className="flex items-center gap-2 justify-between md:justify-end">
            <Skeleton className="h-10 w-24" />
            {" "}
            {/* Sort selector */}
            <Skeleton className="h-10 w-24" />
            {" "}
            {/* View mode toggle */}
            <Skeleton className="h-10 w-24" />
            {" "}
            {/* Filter button */}
          </div>
        </div>
      </div>

      {/* Notes Grid/List Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {Array.from({ length: 6 }).fill(0).map((_, index) => (
          <div key={index} className="grid">
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-center mt-8">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          {" "}
          {/* Previous button */}
          {Array.from({ length: 3 }).fill(0).map((_, index) => (
            <Skeleton key={index} className="h-9 w-9 rounded-md" />
          ))}
          <Skeleton className="h-9 w-9 rounded-md" />
          {" "}
          {/* Next button */}
        </div>
      </div>
    </main>
  );
}
