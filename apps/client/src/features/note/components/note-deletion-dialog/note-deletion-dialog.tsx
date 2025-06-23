import { Loader2 } from "lucide-react";
import { Fragment } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { useDialogStore } from "@/stores";

import { useDeleteNote } from "../../hooks";

export function NoteDeletionDialog() {
  const { isOpen, closeDialog, type, noteId } = useDialogStore();
  const { mutate: deleteNote, isPending: isNoteDeleting } = useDeleteNote();

  const isNoteDeletionDialogOpen = isOpen && type === "delete-note";

  return (
    <Dialog open={isNoteDeletionDialogOpen} onOpenChange={open => !open && closeDialog()}>
      <DialogContent className="sm:max-w-md">
        {isNoteDeleting
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
                  <Button variant="outline" onClick={closeDialog}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={() => deleteNote(noteId)}>
                    Delete
                  </Button>
                </DialogFooter>
              </Fragment>
            )}
      </DialogContent>
    </Dialog>
  );
}
