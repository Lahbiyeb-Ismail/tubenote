"use client";

import { useState } from "react";

import type { Note } from "@tubenote/types";

import { DEFAULT_PAGE, PAGE_LIMIT } from "@/utils/constants";

import { useGetNotesByVideoId } from "@/features/note/hooks";
import { usePaginationQuery, useSortByQueries } from "@/hooks";

import {
  Loader,
  MarkdownViewer,
  PaginationComponent,
  ResizablePanels,
} from "@/components/global";

import { NoDataFound } from "@/components/dashboards";

import {
  VideoNotesList,
  VideoPageHeader,
  VideoPlayer,
} from "@/features/video/components";

function VideoPage({ params }: { params: { videoId: string } }) {
  const { videoId } = params;
  const [openMarkdownViewer, setOpenMarkdownViewer] = useState(false);
  const [note, setNote] = useState<Note | null>(null);

  const { currentPage, setPage } = usePaginationQuery({
    defaultPage: DEFAULT_PAGE,
  });

  const { sortBy, order } = useSortByQueries({});

  const {
    data: notesResponse,
    isLoading: isNotesLoading,
    isError: isNotesError,
  } = useGetNotesByVideoId({
    videoId,
    paginationQuery: { page: currentPage, limit: PAGE_LIMIT, sortBy, order },
  });

  if (isNotesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center container max-w-4xl mx-auto px-4 py-8">
        <Loader />
      </div>
    );
  }

  if (isNotesError) {
    return (
      <div className="min-h-screen flex items-center justify-center container max-w-4xl mx-auto px-4 py-8">
        <h2>Failed to load video notes.</h2>
      </div>
    );
  }

  if (!notesResponse || !notesResponse.notes || !notesResponse.paginationMeta) {
    return <NoDataFound title="You don't have any notes yet for this video." />;
  }

  return (
    <main className="min-h-screen bg-white">
      <VideoPageHeader
        videoId={videoId}
        videoTitle={notesResponse.notes[0].videoTitle}
        isVideoVisible={true}
        onToggleVideo={() => setOpenMarkdownViewer(!openMarkdownViewer)}
      />

      <div className="container h-screen mx-auto px-2 py-6 overflow-auto">
        {notesResponse.notes.length === 0 ? (
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
                  notes={notesResponse.notes}
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
        totalPages={notesResponse.paginationMeta.totalPages}
      />
    </main>
  );
}

export default VideoPage;
