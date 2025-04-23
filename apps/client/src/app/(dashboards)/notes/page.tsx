"use client";

import { useGetUserNotes } from "@/features/note/hooks";
import { usePagination } from "@/hooks/global";

import { DEFAULT_PAGE, PAGE_LIMIT } from "@/utils";

import { NotesList } from "@/features/note/components";

import AddNoteForm from "@/components/dashboards/add-note-form";
import Header from "@/components/dashboards/header";
import NoDataFound from "@/components/dashboards/no-data-found";
import Laoder from "@/components/global/loader";
import PaginationComponent from "@/components/global/pagination";

function NotesPage() {
  const { currentPage, setPage } = usePagination({ defaultPage: DEFAULT_PAGE });

  const { data, isLoading } = useGetUserNotes({
    page: currentPage,
    limit: PAGE_LIMIT,
  });

  if (isLoading) return <Laoder />;

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
