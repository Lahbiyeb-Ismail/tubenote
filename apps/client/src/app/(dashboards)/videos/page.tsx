"use client";

import { DEFAULT_PAGE } from "@/utils/constants";

import { useGetUserVideos } from "@/features/video/hooks";
import { usePagination } from "@/hooks";

import { Loader, PaginationComponent } from "@/components/global";

import { AddNoteForm, Header, NoDataFound } from "@/components/dashboards";

import { VideosList } from "@/features/video/components";

function VideosPage() {
  const { currentPage, setPage } = usePagination({ defaultPage: DEFAULT_PAGE });
  const {
    data: response,
    isLoading,
    isError,
  } = useGetUserVideos({ page: currentPage });

  if (isError) return <div>Something went wrong</div>;

  if (isLoading) return <Loader />;

  if (!response || !response.data || !response.paginationMeta) {
    return <NoDataFound title="You don't have any videos yet." />;
  }

  return (
    <div className="min-h-screen flex-1 bg-gray-100">
      <Header title="Your Videos" />
      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="flex justify-end">
          <AddNoteForm />
        </div>
        <VideosList videos={response.data} />
        <PaginationComponent
          currentPage={currentPage}
          totalPages={response.paginationMeta.totalPages}
          onPageChange={setPage}
        />
      </main>
    </div>
  );
}

export default VideosPage;
