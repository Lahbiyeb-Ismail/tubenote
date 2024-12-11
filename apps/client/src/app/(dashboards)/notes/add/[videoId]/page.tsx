"use client";

import useGetVideoById from "@/hooks/video/useGetVideoById";

import EditorPage from "@/components/editor/EditorPage";
import Loader from "@/components/global/Loader";

function AddNewNotePage({ params }: { params: { videoId: string } }) {
  const { videoId } = params;

  const { data: video, isLoading, isError } = useGetVideoById(videoId);

  if (isError) {
    return <div>Error...</div>;
  }

  if (isLoading || !video) {
    return (
      <div className="min-h-screen flex items-center justify-center container max-w-4xl mx-auto px-4 py-8">
        <Loader />
      </div>
    );
  }

  return <EditorPage video={video} />;
}

export default AddNewNotePage;
