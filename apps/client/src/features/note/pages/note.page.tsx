"use client";

import { VideoPlayer } from "@/features/video/components";
import { Loader, MarkdownViewer, ResizablePanels } from "@/shared/components";
import { useToggleVideoPlayer } from "@/shared/hooks";

import {
  NoteNotFound,
  NotePageHeader,
} from "../components";
import { useGetNoteByIdQuery } from "../queries";

interface IPageProps {
  noteId: string;
}

export function NotePage({ noteId }: IPageProps) {
  const { data: note, isLoading } = useGetNoteByIdQuery(noteId);
  const { isVideoPlayerVisible, toggleVideoPlayer } = useToggleVideoPlayer(true);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!note) {
    return (
      <NoteNotFound />
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <NotePageHeader
        noteId={note.id}
        isVideoVisible={isVideoPlayerVisible}
        onToggleVideo={toggleVideoPlayer}
      />

      {/* Content */}
      <div className="container h-screen mx-auto px-2 py-6 overflow-auto">
        {isVideoPlayerVisible
          ? (
              <ResizablePanels
                leftSideContent={
                  <MarkdownViewer content={note.content} noteTitle={note.title} />
                }
                rightSideContent={<VideoPlayer videoId={note.youtubeId} />}
              />
            )
          : (
              <MarkdownViewer content={note.content} noteTitle={note.title} />
            )}
      </div>
    </main>
  );
}
