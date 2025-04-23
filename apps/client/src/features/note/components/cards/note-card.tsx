"use client";

import type { Note } from "@tubenote/types";

import { useLayout } from "@/context/useLayout";
import { useModal } from "@/context/useModal";
import { useNote } from "@/features/note/contexts";

import CardContent from "@/components/global/CardContent";
import CardFooterWrapper from "@/components/global/CardFooterWrapper";
import CardImage from "@/components/global/CardImage";
import CardSettingsButton from "@/components/global/CardSettingsButton";
import CardWrapper from "@/components/global/CardWrapper";

import { DeleteNoteButton, EditNoteButton } from "../buttons";

type NoteCardProps = {
  note: Note;
};

export function NoteCard({ note }: NoteCardProps) {
  const { deleteNote, isLoading } = useNote();
  const { isGridLayout } = useLayout();
  const { openModal } = useModal();

  const handleDeleteClick = () => {
    openModal({
      title: "Confirm Deletion",
      description:
        "Are you sure you want to delete this note? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      action: "delete",
      onConfirm: () => deleteNote(note.id),
      noteId: note.id,
    });
  };

  return (
    <CardWrapper>
      <CardImage
        src={note.thumbnail}
        alt={note.title}
        isGridLayout={isGridLayout}
      />
      <div
        className={`flex-grow ${
          isGridLayout ? "" : "flex flex-col justify-between"
        }`}
      >
        <div className="flex justify-end p-2">
          <CardSettingsButton
            noteId={note.id}
            onDelete={handleDeleteClick}
            onExport={() => {
              console.log("Export as PDF");
            }}
          />
        </div>
        <CardContent
          cardTitle={note.videoTitle}
          cardDescription={`Note Title: ${note.title}`}
          href={`/notes/${note.id}`}
          isGridLayout={isGridLayout}
        />
        <CardFooterWrapper>
          <EditNoteButton noteId={note.id} isLoading={isLoading} />
          <DeleteNoteButton
            isLoading={isLoading}
            onDelete={handleDeleteClick}
          />
        </CardFooterWrapper>
      </div>
    </CardWrapper>
  );
}
