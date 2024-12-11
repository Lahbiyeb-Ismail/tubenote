"use client";

import Loader from "@/components/global/Loader";
import MarkdownViewer from "@/components/global/MarkdownViewer";
import PaginationComponent from "@/components/global/Pagination";
import ResizablePanels from "@/components/global/ResizablePanels";
import VideoNotesList from "@/components/video/VideoNotesList";
import VideoPageHeader from "@/components/video/VideoPageHeader";
import VideoPlayer from "@/components/video/VideoPlayer";
import usePagination from "@/hooks/global/usePagination";
import useGetVideoNotes from "@/hooks/video/useGetVideoNotes";
import type { Note } from "@/types/note.types";
import { DEFAULT_PAGE } from "@/utils/constants";
import { useState } from "react";

function VideoPage({ params }: { params: { videoId: string } }) {
  const { videoId } = params;
  const [openMarkdownViewer, setOpenMarkdownViewer] = useState(false);
  const [note, setNote] = useState<Note | null>(null);

  const { currentPage, setPage } = usePagination({ defaultPage: DEFAULT_PAGE });

  const { data, isLoading, isError } = useGetVideoNotes({
    videoId,
    page: currentPage,
  });

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center container max-w-4xl mx-auto px-4 py-8">
        <h2>Failed to load video notes.</h2>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center container max-w-4xl mx-auto px-4 py-8">
        <Loader />
      </div>
    );
  }

  // if (!data.notes.length) {
  // 	return (
  // 		<div className="min-h-screen flex items-center justify-center container max-w-4xl mx-auto px-4 py-8">
  // 			<h2>No notes found for this video.</h2>
  // 		</div>
  // 	);
  // }

  return (
    <main className="min-h-screen bg-white">
      <VideoPageHeader
        videoId={videoId}
        videoTitle={data.video.snippet.title}
        isVideoVisible={true}
        onToggleVideo={() => setOpenMarkdownViewer(!openMarkdownViewer)}
      />

      <div className="container h-screen mx-auto px-2 py-6 overflow-auto">
        {data.notes.length === 0 ? (
          <ResizablePanels
            leftSideContent={<h2>No notes found for this video.</h2>}
            rightSideContent={<VideoPlayer videoId={videoId} />}
          />
        ) : (
          <ResizablePanels
            leftSideContent={
              openMarkdownViewer && note ? (
                <MarkdownViewer content={note.content} noteTitle={note.title} />
              ) : (
                <VideoNotesList
                  notes={data.notes}
                  setOpenMarkdownViewer={() => setOpenMarkdownViewer(true)}
                  setNote={setNote}
                />
              )
            }
            rightSideContent={<VideoPlayer videoId={videoId} />}
          />
        )}
      </div>

      <PaginationComponent
        currentPage={currentPage}
        onPageChange={setPage}
        totalPages={data.pagination.totalPages}
      />
    </main>
  );
}

export default VideoPage;
