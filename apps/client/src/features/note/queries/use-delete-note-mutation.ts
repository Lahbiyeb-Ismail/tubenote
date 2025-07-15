"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAppToast } from "@/shared/hooks";
import { useDialogStore } from "@/stores";

import { deleteNote } from "../api";
import { useNoteStore } from "../store";

export function useDeleteNoteMutation() {
  const queryClient = useQueryClient();

  const { noteActions } = useNoteStore();
  const { closeDialog } = useDialogStore();

  const { showErrorToast, showSuccessToast, showLoadingToast, dismissToast } = useAppToast({});

  return useMutation({
    mutationFn: deleteNote,
    onMutate: () => {
      showLoadingToast({ message: "Deleting note...", toastId: "loadingToast" });

      noteActions.setDeleting(true);
    },
    onSuccess: (response) => {
      const { payload } = response;

      queryClient.invalidateQueries({ queryKey: ["notes"] });

      showSuccessToast({ message: payload.message || "Note deleted successfully!" });

      closeDialog();
    },
    onError: (error) => {
      showErrorToast({ message: error.message || "Failed to delete note." });

      noteActions.setError(error);
    },
    onSettled: () => {
      dismissToast({ toastId: "loadingToast" });
      noteActions.setDeleting(false);
    },
  });
}
