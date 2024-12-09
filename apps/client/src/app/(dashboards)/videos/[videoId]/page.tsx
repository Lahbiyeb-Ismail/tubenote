"use client";

import { DEFAULT_PAGE } from "@/utils/constants";

import usePagination from "@/hooks/global/usePagination";
import useGetUserVideos from "@/hooks/video/useGetUserVideos";

import Loader from "@/components/global/Loader";
import PaginationComponent from "@/components/global/Pagination";

import AddNoteForm from "@/components/dashboards/AddNoteForm";
import Header from "@/components/dashboards/Header";
import NoDataFound from "@/components/dashboards/NoDataFound";

import VideosList from "@/components/video/VideosList";

function VideosPage() {
  const { currentPage, setPage } = usePagination({ defaultPage: DEFAULT_PAGE });
  const { data, isLoading, isError } = useGetUserVideos({ page: currentPage });

  if (isError) return <div>Something went wrong</div>;

  if (isLoading) return <Loader />;

  if (!data || !data.videos) {
    return <NoDataFound title="You don't have any videos yet." />;
  }

  return (
    <div className="min-h-screen flex-1 bg-gray-100">
      <Header title="Your Video" />
      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="flex justify-end">
          <AddNoteForm />
        </div>
        <VideosList videos={data.videos} />
        <PaginationComponent
          currentPage={currentPage}
          totalPages={data.pagination.totalPages}
          onPageChange={setPage}
        />
      </main>
    </div>
  );
}

export default VideosPage;
