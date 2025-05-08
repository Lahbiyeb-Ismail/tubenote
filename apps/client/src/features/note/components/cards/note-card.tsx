"use client";

import type { Note } from "@tubenote/types";

import { useLayout, useModal } from "@/context";
import { useNote } from "@/features/note/contexts";

import {
  CardContent,
  CardFooterWrapper,
  CardImage,
  CardSettingsButton,
  CardWrapper,
} from "@/components/global";

import { DeleteNoteButton, EditNoteButton } from "../buttons";

type NoteCardProps = {
  note: Note;
  onDeleteClick: () => void;
};

export function NoteCard({ note, onDeleteClick }: NoteCardProps) {
  const { isGridLayout } = useLayout();
  const { isLoading: isDeletingNote } = useNote();
  const { openModal } = useModal();

  const handleDelete = () => {
    onDeleteClick();
    openModal();
  };

  return (
    <CardWrapper>
      <CardImage
        src={note.thumbnail}
        alt={note.title}
        isGridLayout={isGridLayout}
      />
      <div
        className={`flex-grow ${isGridLayout ? "" : "flex flex-col justify-between"}`}
      >
        <div className="flex justify-end p-2">
          <CardSettingsButton
            noteId={note.id}
            onDelete={handleDelete}
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
          <EditNoteButton noteId={note.id} isLoading={isDeletingNote} />
          <DeleteNoteButton
            isLoading={isDeletingNote}
            onDelete={handleDelete}
          />
        </CardFooterWrapper>
      </div>
    </CardWrapper>
  );
}
