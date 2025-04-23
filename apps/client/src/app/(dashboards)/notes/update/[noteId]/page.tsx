"use client";

import EditorPage from "@/components/editor/editor-page";
import { useGetNoteById } from "@/features/note/hooks";

function UpdateNotePage({ params }: { params: { noteId: string } }) {
  const { noteId } = params;
  const { data, isLoading, isError } = useGetNoteById(noteId);

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <EditorPage
      action="update"
      initialNoteContent={data.content}
      noteTitle={data.title}
      noteId={data.id}
      video={data.videoId}
    />
  );
}

export default UpdateNotePage;
