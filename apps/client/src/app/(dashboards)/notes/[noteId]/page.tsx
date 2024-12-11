"use client";

import useGetNoteById from "@/hooks/note/useGetNoteById";

import Loader from "@/components/global/Loader";
import MarkdownViewer from "@/components/global/MarkdownViewer";
import ResizablePanels from "@/components/global/ResizablePanels";

import NoteError from "@/components/note/NoteError";
import NotePageFooter from "@/components/note/NotePageFooter";
import NotePageHeader from "@/components/note/NotePageHeader";

import VideoPlayer from "@/components/video/VideoPlayer";
import useToggleVideoPlayer from "@/hooks/global/useToggleVideoPlayer";

type NotePageParams = {
  noteId: string;
};

function NotePage({ params }: { params: NotePageParams }) {
  const { noteId } = params;
  const { data, isLoading, isError, refetch } = useGetNoteById(noteId);
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

  if (!data) return null;

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <NotePageHeader
        noteId={data.id}
        noteTitle={data.title}
        isVideoVisible={isVideoPlayerVisible}
        onToggleVideo={toggleVideoPlayer}
      />

      {/* Content */}
      <article className="container h-screen mx-auto px-2 py-6 overflow-auto">
        {isVideoPlayerVisible ? (
          <ResizablePanels
            leftSideContent={
              <MarkdownViewer content={data.content} noteTitle={data.title} />
            }
            rightSideContent={<VideoPlayer videoId={data.youtubeId} />}
          />
        ) : (
          <MarkdownViewer content={data.content} noteTitle={data.title} />
        )}
      </article>

      {/* Footer */}
      <NotePageFooter />
    </main>
  );
}

export default NotePage;
