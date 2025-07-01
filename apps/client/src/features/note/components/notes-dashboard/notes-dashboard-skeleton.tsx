import { Fragment } from "react";

import { PaginationControlsSkeleton } from "@/components/dashboards";

import { NotesListSkeleton } from "./notes-list";

export function NotesDashboardSkeleton() {
  return (
    <Fragment>
      {/* Header Skeleton */}
      {/* <DashboardHeaderSkeleton /> */}

      {/* Search and Filter Skeleton */}
      {/* <SearchAndFilterPanelSkeleton /> */}

      {/* Notes Grid/List Skeleton */}
      <NotesListSkeleton />

      {/* Pagination Skeleton */}
      <PaginationControlsSkeleton />
    </Fragment>
  );
}
