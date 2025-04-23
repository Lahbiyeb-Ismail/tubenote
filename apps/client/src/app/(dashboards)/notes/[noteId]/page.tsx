"use client";

import { useGetNoteById } from "@/features/note/hooks";

import Loader from "@/components/global/loader";
import MarkdownViewer from "@/components/global/markdown-viewer";
import ResizablePanels from "@/components/global/resizable-panels";

import {
  NoteError,
  NotePageFooter,
  NotePageHeader,
} from "@/features/note/components";

import { VideoPlayer } from "@/features/video/components";
import { useToggleVideoPlayer } from "@/hooks/global";

type NotePageParams = {
  noteId: string;
};

function NotePage({ params }: { params: NotePageParams }) {
  const { noteId } = params;
  const { data: note, isLoading, isError, refetch } = useGetNoteById(noteId);
  const { isVideoPlayerVisible, toggleVideoPlayer } = useToggleVideoPlayer();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center container max-w-4xl mx-auto px-4 py-8">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center container max-w-4xl mx-auto px-4 py-8">
        <NoteError onRetry={() => refetch()} />
      </div>
    );
  }

  if (!note) return null;

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <NotePageHeader
        noteId={note.id}
        noteTitle={note.title}
        isVideoVisible={isVideoPlayerVisible}
        onToggleVideo={toggleVideoPlayer}
      />

      {/* Content */}
      <article className="container h-screen mx-auto px-2 py-6 overflow-auto">
        {isVideoPlayerVisible ? (
          <ResizablePanels
            leftSideContent={
              <MarkdownViewer content={note.content} noteTitle={note.title} />
            }
            rightSideContent={<VideoPlayer videoId={note.youtubeId} />}
          />
        ) : (
          <MarkdownViewer content={note.content} noteTitle={note.title} />
        )}
      </article>

      {/* Footer */}
      <NotePageFooter />
    </main>
  );
}

export default NotePage;
