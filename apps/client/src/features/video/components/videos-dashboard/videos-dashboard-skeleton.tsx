import { DashboardHeaderSkeleton, PaginationControlsSkeleton, SearchAndFilterPanelSkeleton } from "@/components/dashboards";

import { VideosListSkeleton } from "./videos-list";

export function VideosDashboardSkeleton() {
  return (
    <main className="container py-6">
      {/* Page Header Skeleton */}
      <DashboardHeaderSkeleton />

      {/* Search and Filter Panel Skeleton */}
      <SearchAndFilterPanelSkeleton />

      {/* Videos Grid/List Skeleton */}
      <VideosListSkeleton />

      {/* Pagination Skeleton */}
      <PaginationControlsSkeleton />
    </main>
  );
}
