import { Loader2, Trash } from "lucide-react";
import { Fragment } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { PrimaryButton, SecondaryButton } from "@/shared/components";
import { useDialogStore } from "@/stores";

import { useNote } from "../../hooks";

export function NoteDeletionDialog() {
  const { isOpen, closeDialog, type, noteId } = useDialogStore();
  const { deleteNote, isDeletingNote } = useNote();

  const isNoteDeletionDialogOpen = isOpen && type === "delete-note";

  return (
    <Dialog open={isNoteDeletionDialogOpen} onOpenChange={open => !open && closeDialog()}>
      <DialogContent className="sm:max-w-md">
        {isDeletingNote
          ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm text-gray-500">Deleting note...</span>
              </div>
            )
          : (
              <Fragment>
                <DialogHeader>
                  <DialogTitle>Confirm Note Deletion</DialogTitle>
                  <DialogDescription>Are you sure you want to delete this note? This action cannot be undone.</DialogDescription>
                </DialogHeader>

                <DialogFooter>
                  <SecondaryButton label="Cancel" onClick={closeDialog} />

                  <PrimaryButton label="Delete" onClick={() => deleteNote(noteId)} icon={Trash} />
                </DialogFooter>
              </Fragment>
            )}
      </DialogContent>
    </Dialog>
  );
}
