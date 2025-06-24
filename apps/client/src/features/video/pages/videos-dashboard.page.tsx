"use client";

import { AddNoteForm, Header } from "@/components/dashboards";
import { Loader, PaginationComponent } from "@/components/global";
import { VideosList } from "@/features/video/components";
import { usePaginationQuery, useSortByQueries } from "@/hooks";
import { DEFAULT_PAGE, PAGE_LIMIT } from "@/utils/constants";

import { NoVideosFound } from "../components";
import { useGetUserVideosQuery } from "../queries";

export function VideosDashboardPage() {
  const { currentPage, setPage } = usePaginationQuery({
    defaultPage: DEFAULT_PAGE,
  });

  const { order, sortBy } = useSortByQueries({});

  const {
    data,
    isLoading,
    isError,
  } = useGetUserVideosQuery({ page: currentPage, limit: PAGE_LIMIT, sortBy, order });

  if (isLoading)
    return <Loader />;

  if (isError)
    return <div>Something went wrong</div>;

  if (!data || !data.videos || !data.paginationMeta) {
    return <NoVideosFound />;
  }

  return (
    <div className="min-h-screen flex-1 bg-gray-100">
      <Header title="Your Videos" />
      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="flex justify-end">
          <AddNoteForm />
        </div>
        <VideosList videos={data.videos} />
        <PaginationComponent
          currentPage={currentPage}
          totalPages={data.paginationMeta.totalPages}
          onPageChange={setPage}
        />
      </main>
    </div>
  );
}
