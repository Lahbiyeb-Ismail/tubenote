import { Fragment } from "react";

import { PaginationControlsSkeleton } from "@/components/dashboards";

import { VideosListSkeleton } from "./videos-list";

export function VideosDashboardSkeleton() {
  return (
    <Fragment>
      {/* Videos Grid/List Skeleton */}
      <VideosListSkeleton />

      {/* Pagination Skeleton */}
      <PaginationControlsSkeleton />
    </Fragment>
  );
}
