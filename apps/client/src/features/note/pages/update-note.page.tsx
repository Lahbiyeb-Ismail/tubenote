"use client";

import { NotePageLayout } from "../components";
import { useNote } from "../hooks";
import { useGetNoteByIdQuery } from "../queries";
import { useNoteStore } from "../store";

interface IPageProps {
  noteId: string;
}

export function UpdateNotePage({ noteId }: IPageProps) {
  const { noteTimestamp } = useNoteStore();
  const { updateNote, isUpdatingNote } = useNote();
  const { data: note, isLoading, isError } = useGetNoteByIdQuery(noteId);

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
