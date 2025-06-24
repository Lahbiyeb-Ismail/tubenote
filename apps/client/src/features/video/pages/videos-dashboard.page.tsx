"use client";

import { useState } from "react";

import { DashboardHeader, SearchAndFilterPanel } from "@/components/dashboards";
import { Loader, PaginationComponent } from "@/components/global";
import { usePaginationQuery, useSortByQueries } from "@/hooks";
import { DEFAULT_PAGE, PAGE_LIMIT } from "@/utils/constants";

import { NoVideosFound, VideosList } from "../components";
import { useGetUserVideosQuery } from "../queries";

export function VideosDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const { currentPage, setPage } = usePaginationQuery({
    defaultPage: DEFAULT_PAGE,
  });

  const { order } = useSortByQueries({});

  const {
    data,
    isLoading,
  } = useGetUserVideosQuery({ page: currentPage, limit: PAGE_LIMIT, sortBy, order });

  if (isLoading || !data)
    return <Loader />;

  if (data.videos.length === 0 || !data.paginationMeta) {
    return <NoVideosFound />;
  }

  return (
    <main className="container py-6">
      {/* Page Header */}
      <DashboardHeader title="Video Library 📼" description="Discover, watch, and organize your learning videos" />

      {/* Search and Filter Component */}
      <SearchAndFilterPanel inputSearchPlaceholder="Search videos, tags, or content..." searchQuery={searchQuery} setSearchQuery={setSearchQuery} showFilters={showFilters} setShowFilters={setShowFilters} sortBy={sortBy} setSortBy={setSortBy} viewMode={viewMode} setViewMode={setViewMode} />

      {/* Videos List */}
      <VideosList viewMode={viewMode} videos={data.videos} />

      {/* Pagination Component */}
      {data.videos.length >= PAGE_LIMIT
        ? (
            <PaginationComponent
              currentPage={currentPage}
              totalPages={data.paginationMeta.totalPages}
              onPageChange={setPage}
            />
          )
        : null}
    </main>
  );
}
