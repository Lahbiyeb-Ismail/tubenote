"use client";

import { useGetVideoById } from "@/features/video/hooks";

import { EditorPage } from "@/components/editor";
import { Loader } from "@/components/global";

function AddNewNotePage({ params }: { params: { videoId: string } }) {
  const { videoId } = params;

  const { data, isLoading } = useGetVideoById(videoId);

  if (isLoading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center container max-w-4xl mx-auto px-4 py-8">
        <Loader />
      </div>
    );
  }

  return <EditorPage video={data} />;
}

export default AddNewNotePage;
