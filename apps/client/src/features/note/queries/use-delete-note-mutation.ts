"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useDialogStore } from "@/stores";

import { deleteNote } from "../api";
import { useNoteStore } from "../store";

export function useDeleteNoteMutation() {
  const queryClient = useQueryClient();

  const { noteActions } = useNoteStore();
  const { closeDialog } = useDialogStore();

  return useMutation({
    mutationFn: deleteNote,
    onMutate: () => {
      toast.loading("Deleting note...", { id: "loadingToast" });

      noteActions.setDeleting(true);
    },
    onSuccess: (response) => {
      const { payload } = response;

      queryClient.invalidateQueries({ queryKey: ["notes"] });

      toast.success(payload.message);

      closeDialog();
    },
    onError: (error) => {
      toast.error(error.message);

      noteActions.setError(error);
    },
    onSettled: () => {
      toast.dismiss("loadingToast");
      noteActions.setDeleting(false);
    },
  });
}
