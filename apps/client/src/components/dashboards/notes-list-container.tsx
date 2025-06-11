"use client";

import type { Note } from "@tubenote/db";
import type { ReactNode } from "react";

import { useState } from "react";

import { useDeleteNote } from "@/features/note/hooks";
import { useUIStore } from "@/stores";

import { DeleteConfirmationDialog } from "../global";

interface NotesListContainerProps {
  notes: Note[];
  containerClassName?: string;
  children: (note: Note, onDeleteClick: (noteId: string) => void) => ReactNode;
  deleteDialogTitle?: string;
  deleteDialogDescription?: string;
}

export function NotesListContainer({
  notes,
  containerClassName = "md:px-4 py-6 space-y-4",
  children,
  deleteDialogTitle,
  deleteDialogDescription,
}: NotesListContainerProps) {
  const { actions } = useUIStore();
  const { mutate: deleteNote, isPending: isDeletingNote } = useDeleteNote();
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  const handleOpenDeleteModal = (noteId: string) => {
    setNoteToDelete(noteId);
  };

  const handleDeleteNote = () => {
    if (noteToDelete) {
      deleteNote(noteToDelete);
      setNoteToDelete(null);
      actions.closeModal();
    }
  };

  const handleCancelDelete = () => {
    setNoteToDelete(null);
    actions.closeModal();
  };

  return (
    <>
      <div className={containerClassName}>
        {notes.map(note => children(note, handleOpenDeleteModal))}
      </div>

      <DeleteConfirmationDialog
        title={deleteDialogTitle}
        description={deleteDialogDescription}
        isDeleting={isDeletingNote}
        onConfirm={handleDeleteNote}
        onCancel={handleCancelDelete}
      />
    </>
  );
}
