"use client";

import { useGetVideoById } from "@/features/video/hooks";

import EditorPage from "@/components/editor/editor-page";
import Loader from "@/components/global/loader";

function AddNewNotePage({ params }: { params: { videoId: string } }) {
  const { videoId } = params;

  const { data: response, isLoading, isError } = useGetVideoById(videoId);

  if (isError) {
    return <div>Error...</div>;
  }

  if (isLoading || !response) {
    return (
      <div className="min-h-screen flex items-center justify-center container max-w-4xl mx-auto px-4 py-8">
        <Loader />
      </div>
    );
  }

  return <EditorPage video={response.data} />;
}

export default AddNewNotePage;
