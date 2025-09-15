"use client";

import { Fragment, useState } from "react";

import { DashboardHeader, PaginationControls, SearchAndFilterPanel } from "@/shared/components";
import { DEFAULT_PAGE, PAGE_LIMIT } from "@/shared/constants";
import { useUrlState } from "@/shared/hooks";
import { useDialogStore } from "@/stores";

import { useGetUserVideosQuery } from "../../queries";
import { NoVideosFound, VideosDashboardSkeleton, VideosList } from "./components";

export function VideosDashboardPage() {
  const { openDialog } = useDialogStore();

  const [searchQuery, setSearchQuery] = useUrlState("q", "");
  const [sortBy, setSortBy] = useUrlState("sortBy", "createdAt");
  const [order] = useUrlState("order", "desc");
  const [page, setPage] = useUrlState("page", DEFAULT_PAGE);
  const [viewMode, setViewMode] = useUrlState<"grid" | "list">("view", "grid");
  const [showFilters, setShowFilters] = useState(false);

  const {
    data,
    isLoading,
  } = useGetUserVideosQuery({ page: String(page), limit: String(PAGE_LIMIT), sortBy, order, q: searchQuery });

  if (!searchQuery && data?.videos.length === 0)
    return <NoVideosFound />;

  return (
    <main className="container py-6">
      {/* Page Header */}
      <DashboardHeader
        title="Video Library 📼"
        description="Discover, watch, and organize your learning videos"
        buttonProps={{
          onClick: () => openDialog("add-video"),
          label: "New Video",
        }}
      />

      {/* Search and Filter Component */}
      <SearchAndFilterPanel inputSearchPlaceholder="Search videos, tags, or content..." searchQuery={searchQuery} setSearchQuery={setSearchQuery} showFilters={showFilters} setShowFilters={setShowFilters} sortBy={sortBy} setSortBy={setSortBy} viewMode={viewMode} setViewMode={setViewMode} />

      {isLoading || !data
        ? (
            <VideosDashboardSkeleton />
          )
        : (
            <Fragment>
              {data.videos.length === 0
                ? (
                    <div className="flex flex-col items-center justify-center h-64">
                      <h2 className="text-center text-gray-500">No Videos Found.</h2>
                      <p className="text-center text-gray-400">
                        Try adjusting your search or filters to find videos.
                      </p>
                    </div>
                  )
                : (
                    <Fragment>
                      {/* Videos List */}
                      <VideosList viewMode={viewMode} videos={data.videos} />

                      {/* Pagination Component */}
                      {data.videos.length >= PAGE_LIMIT && data.paginationMeta
                        ? (
                            <PaginationControls
                              currentPage={page}
                              totalPages={data.paginationMeta.totalPages}
                              onPageChange={setPage}
                            />
                          )
                        : null}
                    </Fragment>
                  )}
            </Fragment>
          )}
    </main>
  );
}
