"use client";

import { useState } from "react";

import { useGetNotesByVideoIdQuery } from "@/features/note/queries";
import {
  VideoPlayer,
} from "@/features/video/components";
import { usePaginationQuery, useSortByQueries } from "@/hooks";
import { DEFAULT_PAGE, PAGE_LIMIT } from "@/utils/constants";

import { VideoNotes, VideoPageHeader, VideoPageSkeleton } from "./components";

interface IPageProps {
  videoId: string;
}

export function VideoPage({ videoId }: IPageProps) {
  const { currentPage } = usePaginationQuery({
    defaultPage: DEFAULT_PAGE,
  });

  const { sortBy, order } = useSortByQueries({});
  const [searchQuery, setSearchQuery] = useState("");

  const { data: notesResponse, isLoading: isNotesLoading } = useGetNotesByVideoIdQuery({
    videoId,
    paginationQuery: { page: currentPage, limit: PAGE_LIMIT, sortBy, order },
  });

  if (isNotesLoading || !notesResponse) {
    return (
      <VideoPageSkeleton />
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <VideoPageHeader
        ytVideoId={videoId}
      />

      <div className="container py-6 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
          <VideoNotes notes={notesResponse.notes} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          <div className="lg:col-span-2 flex flex-col space-y-4 relative">
            <VideoPlayer videoId={videoId} />
          </div>
        </div>
      </div>
    </main>
  );
}
