"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useAppToast } from "@/shared/hooks";
import { useDialogStore } from "@/stores";

import { createNote } from "../api";
import { useNoteStore } from "../store";

export function useCreateNoteMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { noteActions } = useNoteStore();
  const { closeDialog } = useDialogStore();

  const { showErrorToast, showSuccessToast, showLoadingToast, dismissToast } = useAppToast({});

  return useMutation({
    mutationFn: createNote,
    onMutate: () => {
      // Show a loading toast
      showLoadingToast({ message: "Saving note...", toastId: "loadingToast" });

      noteActions.setCreating(true);
    },
    onSuccess: (response) => {
      const { payload } = response;

      // Show success toast
      showSuccessToast({ message: payload.message || "Note created successfully!" });

      // Invalidate notes query to refetch notes
      queryClient.invalidateQueries({ queryKey: ["notes"] });

      router.push(`/notes/${payload.data.id}`);
    },
    onError: (error) => {
      showErrorToast({ message: error.message || "Failed to create note." });

      noteActions.setError(error);
    },
    onSettled: () => {
      dismissToast({ toastId: "loadingToast" });
      noteActions.setCreating(false);
      closeDialog();
    },
  });
}
