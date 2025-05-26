"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useUIStore } from "@/stores";

import { updateNote } from "../services";
import { useNoteStore } from "../store";

export function useUpdateNote() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { actions } = useUIStore();
  const { noteActions } = useNoteStore();

  return useMutation({
    mutationFn: updateNote,
    onMutate: () => {
      toast.loading("Updating note...", { id: "loadingToast" });

      noteActions.setUpdating(true);
    },
    onSuccess: (response) => {
      const { payload } = response;
      const noteId = payload.data.id;

      toast.success(payload.message);

      queryClient.invalidateQueries({
        queryKey: ["note", noteId],
      });

      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });

      actions.closeModal();

      router.push(`/notes/${noteId}`);
    },
    onError: (error) => {
      toast.error(error.message);

      noteActions.setError(error);
    },
    onSettled: () => {
      toast.dismiss("loadingToast");
      noteActions.setUpdating(false);
    },
  });
}
