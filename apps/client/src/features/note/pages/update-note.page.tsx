"use client";

import { NotePageLayout } from "@/features/note/components";
import { useGetNoteById, useUpdateNote } from "@/features/note/hooks";

import { useNoteStore } from "../store";

interface IPageProps {
  noteId: string;
}

export function UpdateNotePage({ noteId }: IPageProps) {
  const { mutate: updateNote, isPending: isUpdatingNote } = useUpdateNote();
  const { noteTimestamp } = useNoteStore();
  const { data: note, isLoading, isError } = useGetNoteById(noteId);

  const handleUpdateNote = (title: string, content: string, category: string, tags: string[]) => {
    if (!note)
      return;

    updateNote({
      noteId: note.id,
      updateData: {
        title,
        content,
        tags,
        category,
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
      handleSaveNote={handleUpdateNote}
    />
  );
}
