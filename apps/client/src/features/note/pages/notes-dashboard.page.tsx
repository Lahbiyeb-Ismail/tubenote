"use client";

import { Fragment, useState } from "react";

import { DashboardHeader, PaginationControls, SearchAndFilterPanel } from "@/components/dashboards";
import { useUrlState } from "@/hooks";
import { DEFAULT_PAGE, PAGE_LIMIT } from "@/utils";

import { NoNotesFound } from "../components";
import { NotesDashboardSkeleton, NotesList } from "../components/notes-dashboard";
import { useGetUserNotesQuery, useSearchNotesQuery } from "../queries";

export function NotesDashboardPage() {
  const [searchQuery, setSearchQuery] = useUrlState("q", "");
  const [sortBy, setSortBy] = useUrlState("sortBy", "createdAt");
  const [order] = useUrlState("order", "desc");
  const [page, setPage] = useUrlState("page", DEFAULT_PAGE);
  const [viewMode, setViewMode] = useUrlState<"grid" | "list">("view", "grid");
  const [showFilters, setShowFilters] = useState(false);

  const { data: notesData, isLoading: isNotesLoading } = useGetUserNotesQuery({
    page,
    limit: PAGE_LIMIT,
    sortBy,
    order,
  });

  const { data: searchData, isLoading: isSearchLoading } = useSearchNotesQuery(
    searchQuery,
    {
      page,
      limit: PAGE_LIMIT,
      sortBy,
      order,
    },
  );

  if (notesData?.notes.length === 0) {
    return <NoNotesFound />;
  }

  const isLoading = isNotesLoading || isSearchLoading;
  const data = searchQuery ? searchData : notesData;

  return (
    <main className="container py-6">
      {/* Page Header */}
      <DashboardHeader title="Your Notes 🗒" description="Manage and organize all your video notes in one place." />

      {/* Search and Filter Component */}
      <SearchAndFilterPanel
        inputSearchPlaceholder="Search notes, tags, or content..."
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {isLoading || !data
        ? (
            <NotesDashboardSkeleton />
          )
        : (
            <Fragment>
              {data.notes.length === 0
                ? (
                    <div className="flex flex-col items-center justify-center h-64">
                      <h2 className="text-center text-gray-500">No notes found.</h2>
                      <p className="text-center text-gray-400">
                        Try adjusting your search or filters to find notes.
                      </p>
                    </div>
                  )
                : (
                    <Fragment>
                      {/* Notes List */}
                      <NotesList viewMode={viewMode} notes={data.notes} />

                      {/* Pagination Component */}
                      {data.notes.length >= PAGE_LIMIT && data.paginationMeta
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
