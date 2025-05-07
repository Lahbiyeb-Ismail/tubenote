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
  ConfirmationModal,
} from "@/components/global";

import { Button, DialogFooter } from "@/components/ui";
import { DeleteNoteButton, EditNoteButton } from "../buttons";

type NoteCardProps = {
  note: Note;
};

export function NoteCard({ note }: NoteCardProps) {
  const { isGridLayout } = useLayout();
  const { deleteNote, isLoading: isDeletingNote } = useNote();
  const { openModal, closeModal } = useModal();

  return (
    <>
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
              onDelete={openModal}
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
            <DeleteNoteButton isLoading={isDeletingNote} onDelete={openModal} />
          </CardFooterWrapper>
        </div>
      </CardWrapper>

      <ConfirmationModal
        title="Confirm Note Deletion"
        description="Are you sure you want to delete this note? This action cannot be undone."
      >
        <DialogFooter>
          <Button variant="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              deleteNote(note.id);
              closeModal();
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </ConfirmationModal>
    </>
  );
}
