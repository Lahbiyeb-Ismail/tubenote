import { DashboardHeaderSkeleton, PaginationControlsSkeleton, SearchAndFilterPanelSkeleton } from "@/components/dashboards";

import { NotesListSkeleton } from "./notes-list";

export function NotesDashboardSkeleton() {
  return (
    <main className="container py-6">
      {/* Header Skeleton */}
      <DashboardHeaderSkeleton />

      {/* Search and Filter Skeleton */}
      <SearchAndFilterPanelSkeleton />

      {/* Notes Grid/List Skeleton */}
      <NotesListSkeleton />

      {/* Pagination Skeleton */}
      <PaginationControlsSkeleton />
    </main>
  );
}
