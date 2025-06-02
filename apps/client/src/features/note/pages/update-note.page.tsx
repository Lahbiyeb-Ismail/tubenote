"use client";

import { useGetNoteById, useUpdateNote } from "@/features/note/hooks";

import { NotePageLayout } from "@/features/note/components";
import { useNoteStore } from "../store";

interface IPageProps {
  noteId: string;
}

export function UpdateNotePage({ noteId }: IPageProps) {
  const { mutate: updateNote, isPending: isUpdatingNote } = useUpdateNote();
  const { noteTimestamp } = useNoteStore();
  const { data: note, isLoading, isError } = useGetNoteById(noteId);

  const handleUpdateNote = (noteTitle: string, content: string) => {
    if (!note) return;

    updateNote({
      noteId: note.id,
      updateData: {
        title: noteTitle,
        content: content,
        timestamp: noteTimestamp,
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
      noteTitle={note?.title}
      isLoading={isLoading || !note}
      isSavingNote={isUpdatingNote}
      modalTitle="Confirm Update Note"
      modalDescription="Are you sure you want to update this note?"
      handleSaveNote={handleUpdateNote}
    />
  );
}
