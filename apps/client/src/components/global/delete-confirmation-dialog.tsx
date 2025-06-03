"use client";

import { ConfirmationModal } from "@/components/global";
import { Button, DialogFooter } from "@/components/ui";

type DeleteConfirmationDialogProps = {
  title?: string;
  description?: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function DeleteConfirmationDialog({
  title = "Confirm Note Deletion",
  description = "Are you sure you want to delete this note? This action cannot be undone.",
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteConfirmationDialogProps) {
  return (
    <ConfirmationModal title={title} description={description}>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel} disabled={isDeleting}>
          Cancel
        </Button>
        <Button variant="destructive" disabled={isDeleting} onClick={onConfirm}>
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </DialogFooter>
    </ConfirmationModal>
  );
}
