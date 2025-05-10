"use client";

import type { Note } from "@tubenote/types";
import { useState } from "react";

import { useLayout, useModal } from "@/context";

import { useNote } from "@/features/note/contexts";

import { ConfirmationModal } from "@/components/global";
import { Button, DialogFooter } from "@/components/ui";

import { NoteCard } from "../cards";

type NotesListProps = {
  notes: Note[];
};

export function NotesList({ notes }: NotesListProps) {
  const { isGridLayout } = useLayout();
  const { deleteNote, isLoading: isDeletingNote } = useNote();
  const { closeModal } = useModal();
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  const handleOpenDeleteModal = (noteId: string) => {
    setNoteToDelete(noteId);
  };

  const handleDeleteNote = () => {
    if (noteToDelete) {
      deleteNote(noteToDelete);
      setNoteToDelete(null);
      closeModal();
    }
  };

  return (
    <div className="md:px-4 py-6">
      <div
        className={`${isGridLayout ? "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4" : "space-y-4"}`}
      >
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onDeleteClick={() => handleOpenDeleteModal(note.id)}
          />
        ))}
      </div>

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
            disabled={isDeletingNote}
            onClick={handleDeleteNote}
          >
            Delete
          </Button>
        </DialogFooter>
      </ConfirmationModal>
    </div>
  );
}
