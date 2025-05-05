"use client";

import { useModal } from "@/context";

import { SaveNoteForm } from "@/components/editor";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";

export function ConfirmationModal() {
  const { isOpen, modalContent, closeModal } = useModal();

  if (!modalContent) return null;

  const {
    title,
    description,
    confirmText,
    cancelText,
    onConfirm,
    action,
    noteContent,
    noteTitle,
    noteId,
    video,
  } = modalContent;

  const handleConfirm = () => {
    onConfirm?.();
    closeModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {action === "delete" ? (
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>
              {cancelText}
            </Button>
            <Button variant="destructive" onClick={handleConfirm}>
              {confirmText}
            </Button>
          </DialogFooter>
        ) : (
          <DialogDescription>
            <SaveNoteForm
              action={action}
              noteContent={noteContent || ""}
              noteTitle={noteTitle as string}
              noteId={noteId as string}
              cancelText={cancelText}
              closeModal={closeModal}
              video={video}
            />
          </DialogDescription>
        )}
      </DialogContent>
    </Dialog>
  );
}
