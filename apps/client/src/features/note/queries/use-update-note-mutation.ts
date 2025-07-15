"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useAppToast } from "@/shared/hooks";
import { useDialogStore } from "@/stores";

import { updateNote } from "../api";
import { useNoteStore } from "../store";

export function useUpdateNoteMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { closeDialog } = useDialogStore();
  const { noteActions } = useNoteStore();

  const { showErrorToast, showSuccessToast, showLoadingToast, dismissToast } = useAppToast({});

  return useMutation({
    mutationFn: updateNote,
    onMutate: () => {
      showLoadingToast({ message: "Updating note...", toastId: "loadingToast" });

      noteActions.setUpdating(true);
    },
    onSuccess: (response) => {
      const { payload } = response;
      const noteId = payload.data.id;

      showSuccessToast({ message: payload.message || "Note updated successfully!" });

      queryClient.invalidateQueries({
        queryKey: ["note", noteId],
      });

      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });

      router.push(`/notes/${noteId}`);
    },
    onError: (error) => {
      showErrorToast({ message: error.message || "Failed to update note." });

      noteActions.setError(error);
    },
    onSettled: () => {
      dismissToast({ toastId: "loadingToast" });
      noteActions.setUpdating(false);
      closeDialog();
    },
  });
}
