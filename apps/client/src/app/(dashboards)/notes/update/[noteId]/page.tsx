"use client";

import type { MDXEditorMethods } from "@mdxeditor/editor";
import { Suspense, useRef } from "react";

import AppMDXEditor from "@/components/editor/mdx-editor";

import { Loader, ResizablePanels } from "@/components/global";
import { useGetNoteById } from "@/features/note/hooks";
import { VideoPlayer } from "@/features/video/components";

function UpdateNotePage({ params }: { params: { noteId: string } }) {
  const { noteId } = params;
  const editorRef = useRef<MDXEditorMethods | null>(null);

  const { data: note, isLoading, isError } = useGetNoteById(noteId);

  if (isLoading || !note) {
    return (
      <div className="min-h-screen flex items-center justify-center container max-w-4xl mx-auto px-4 py-8">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <div className="flex h-screen bg-white">
      <ResizablePanels
        leftSideContent={
          <Suspense fallback={null}>
            <AppMDXEditor editorRef={editorRef} noteContent={note.content} />
          </Suspense>
        }
        rightSideContent={<VideoPlayer videoId={note.youtubeId} />}
      />
    </div>
  );
}

export default UpdateNotePage;
