"use client";

import { useNote } from "@/features/note/contexts";
import { useVideo } from "@/features/video/contexts";
import { useGetVideoById } from "@/features/video/hooks";

import { NotePageLayout } from "@/features/note/components";

function CreateNotePage({ params }: { params: { videoId: string } }) {
  const { videoId } = params;
  const { createNote, isLoading: isSavingNote } = useNote();
  const { videoCurrentTime } = useVideo();
  const { data: videoData, isLoading } = useGetVideoById(videoId);

  const handleCreateNote = (noteTitle: string, content: string) => {
    if (!videoData) return;

    createNote({
      videoId: videoData.id,
      createNoteData: {
        title: noteTitle,
        content: content,
        thumbnail: videoData.thumbnails.medium.url,
        videoTitle: videoData.title,
        youtubeId: videoData.youtubeId,
        timestamp: videoCurrentTime,
      },
    });
  };

  return (
    <NotePageLayout
      videoId={videoId}
      isLoading={isLoading || !videoData}
      isSavingNote={isSavingNote}
      modalTitle="Confirm Save Note"
      modalDescription="Are you sure you want to save this note?"
      handleSaveNote={handleCreateNote}
    />
  );
}

export default CreateNotePage;
