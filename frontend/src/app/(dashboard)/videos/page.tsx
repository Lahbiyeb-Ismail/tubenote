"use client";

import useGetUserVideos from "@/hooks/note/useGetUserVideos";

import AddNoteForm from "@/components/dashboards/AddNoteForm";
import Header from "@/components/dashboards/Header";
import NoDataFound from "@/components/dashboards/NoDataFound";
import Loader from "@/components/global/Loader";

function VideosPage() {
  const { data, isLoading } = useGetUserVideos();

  if (isLoading) return <Loader />;

  return (
    <>
      {!data ? (
        <NoDataFound title="You don't have any videos yet." />
      ) : (
        <div className="min-h-screen flex-1 bg-gray-100">
          <Header title="Your Video" />
          <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <div className="flex justify-end">
              <AddNoteForm />
            </div>
            {/* <NotesList notes={data} /> */}
          </main>
        </div>
      )}
    </>
  );
}

export default VideosPage;
