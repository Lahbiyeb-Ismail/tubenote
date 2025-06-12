"use client";

import { AddNoteForm, Header } from "@/components/dashboards";
import { Loader, PaginationComponent } from "@/components/global";
import { NoNotesFound, NotesList } from "@/features/note/components";
import { useGetUserNotes } from "@/features/note/hooks";
import { usePaginationQuery, useSortByQueries } from "@/hooks";
import { DEFAULT_PAGE, PAGE_LIMIT } from "@/utils";

export function AllNotesPage() {
  const { currentPage, setPage } = usePaginationQuery({
    defaultPage: DEFAULT_PAGE,
  });

  const { order, sortBy } = useSortByQueries({});

  const { data, isLoading: isNotesLoading } = useGetUserNotes({
    page: currentPage,
    limit: PAGE_LIMIT,
    sortBy,
    order,
  });

  if (isNotesLoading || !data)
    return <Loader />;

  if (data.notes.length === 0 || !data.paginationMeta) {
    return <NoNotesFound />;
  }

  return (
    <div className="min-h-screen flex-1 bg-gray-100">
      <Header title="Your Video Notes" />
      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="flex justify-end">
          <AddNoteForm />
        </div>
        <NotesList notes={data.notes} />
        <PaginationComponent
          currentPage={currentPage}
          totalPages={data.paginationMeta.totalPages}
          onPageChange={setPage}
        />
      </main>
    </div>
  );
}
