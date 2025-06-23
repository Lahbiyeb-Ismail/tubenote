"use client";

import { useState } from "react";

import { DashboardHeader } from "@/components/dashboards";
import { PaginationComponent } from "@/components/global";
import { NoNotesFound } from "@/features/note/components";
import { useGetUserNotes } from "@/features/note/hooks";
import { usePaginationQuery, useSortByQueries } from "@/hooks";
import { DEFAULT_PAGE, PAGE_LIMIT } from "@/utils";

import { NotesDashboardSkeleton, NotesList, NotesSearchAndFilter } from "../components/notes-dashboard";

export function NotesDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  // const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("createdAt");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  // const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  // const [activeTab, setActiveTab] = useState("all");

  const { currentPage, setPage } = usePaginationQuery({
    defaultPage: DEFAULT_PAGE,
  });

  const { order } = useSortByQueries({});

  const { data, isLoading: isNotesLoading } = useGetUserNotes({
    page: currentPage,
    limit: PAGE_LIMIT,
    sortBy,
    order,
  });

  if (isNotesLoading || !data)
    return <NotesDashboardSkeleton />;

  if (data.notes.length === 0 || !data.paginationMeta) {
    return <NoNotesFound />;
  }

  return (
    <main className="container py-6">
      {/* Page Header */}
      <DashboardHeader title="Your Notes 🗒" description="Manage and organize all your video notes in one place." />

      {/* Search and Filter Component */}
      <NotesSearchAndFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} showFilters={showFilters} setShowFilters={setShowFilters} sortBy={sortBy} setSortBy={setSortBy} viewMode={viewMode} setViewMode={setViewMode} />

      {/* Notes List */}
      <NotesList viewMode={viewMode} notes={data.notes} />

      {/* Pagination Component */}
      {data.notes.length >= PAGE_LIMIT
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
