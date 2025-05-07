"use client";

import { useNote } from "@/features/note/contexts";
import { useGetNoteById } from "@/features/note/hooks";
import { useVideo } from "@/features/video/contexts";

import { NotePageLayout } from "@/features/note/components";

function UpdateNotePage({ params }: { params: { noteId: string } }) {
  const { noteId } = params;
  const { updateNote, isLoading: isUpdatingNote } = useNote();
  const { videoCurrentTime } = useVideo();
  const { data: note, isLoading, isError } = useGetNoteById(noteId);

  const handleUpdateNote = (noteTitle: string, content: string) => {
    if (!note) return;

    updateNote({
      noteId: note.id,
      updateData: {
        title: noteTitle,
        content: content,
        timestamp: videoCurrentTime,
      },
    });
  };

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <NotePageLayout
      videoId={note?.youtubeId || ""}
      noteContent={note?.content}
      isLoading={isLoading || !note}
      isSavingNote={isUpdatingNote}
      modalTitle="Confirm Update Note"
      modalDescription="Are you sure you want to update this note?"
      handleSaveNote={handleUpdateNote}
    />
  );
}

export default UpdateNotePage;
