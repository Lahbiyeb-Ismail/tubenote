"use client";

import { useGetUserNotes } from "@/features/note/hooks";
import { usePaginationQuery, useSortByQueries } from "@/hooks";

import { DEFAULT_PAGE, PAGE_LIMIT } from "@/utils";

import { AddNoteForm, Header, NoDataFound } from "@/components/dashboards";
import { Loader, PaginationComponent } from "@/components/global";
import { NotesList } from "@/features/note/components";

function NotesPage() {
  const { currentPage, setPage } = usePaginationQuery({
    defaultPage: DEFAULT_PAGE,
  });

  const { order, sortBy } = useSortByQueries({});

  const { data, isLoading } = useGetUserNotes({
    page: currentPage,
    limit: PAGE_LIMIT,
    sortBy,
    order,
  });

  if (isLoading) return <Loader />;

  if (!data || !data.notes || !data.paginationMeta)
    return <NoDataFound title="You don't have any notes yet." />;

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

export default NotesPage;
