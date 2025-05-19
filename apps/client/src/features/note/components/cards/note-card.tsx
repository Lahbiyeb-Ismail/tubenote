"use client";

import type { Note } from "@tubenote/types";

import { useNote } from "@/features/note/contexts";
import { useUIStore } from "@/stores";

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
  const { layout, actions } = useUIStore();
  const { isLoading: isDeletingNote } = useNote();

  const handleDelete = () => {
    onDeleteClick();
    actions.openModal();
  };

  return (
    <CardWrapper>
      <CardImage
        src={note.thumbnail}
        alt={note.title}
        isGridLayout={layout.isGridLayout}
      />
      <div
        className={`flex-grow ${layout.isGridLayout ? "" : "flex flex-col justify-between"}`}
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
          isGridLayout={layout.isGridLayout}
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
