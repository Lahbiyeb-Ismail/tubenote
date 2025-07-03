import { Fragment } from "react";

import { PaginationControlsSkeleton } from "@/components/dashboards";

import { NotesListSkeleton } from "./notes-list";

export function NotesDashboardSkeleton() {
  return (
    <Fragment>
      {/* Notes Grid/List Skeleton */}
      <NotesListSkeleton />

      {/* Pagination Skeleton */}
      <PaginationControlsSkeleton />
    </Fragment>
  );
}
