"use client";

import { useEffect } from "react";

import { NotePageLayout } from "@/features/note/components";
import { useNote } from "@/features/note/hooks";
import { useGetVideoById } from "@/features/video/hooks";
import { useVideoNoteStore } from "@/features/video/store";

interface IPageProps {
  videoId: string;
}

export function CreateNotePage({ videoId }: IPageProps) {
  const { data: videoData, isLoading } = useGetVideoById(videoId);

  const { createNote, isCreatingNote } = useNote();
  const { noteTimestamp, startNoteSync, stopNoteSync } = useVideoNoteStore();

  useEffect(() => {
    startNoteSync();
    return () => {
      stopNoteSync();
    };
  }, [startNoteSync, stopNoteSync]);

  const handleCreateNote = (title: string, content: string, category: string, tags: string[]) => {
    if (!videoData)
      return;

    createNote({
      videoId: videoData.id,
      createNoteData: {
        title,
        content,
        tags,
        category,
        thumbnail: videoData.thumbnails.medium.url,
        videoTitle: videoData.title,
        youtubeId: videoData.youtubeId,
        timestamp: noteTimestamp,
      },
    });
  };

  return (
    <NotePageLayout
      videoId={videoId}
      isLoading={isLoading || !videoData}
      isSavingNote={isCreatingNote}
      handleSaveNote={handleCreateNote}
    />
  );
}
