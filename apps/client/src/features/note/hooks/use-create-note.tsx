"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { createNote } from "../services";
import { useNoteStore } from "../store";

export function useCreateNote() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { noteActions } = useNoteStore();

  return useMutation({
    mutationFn: createNote,
    onMutate: () => {
      // Show a loading toast
      toast.loading("Saving note...", { id: "loadingToast" });

      noteActions.setCreating(true);
    },
    onSuccess: (response) => {
      const { payload } = response;

      // Show success toast
      toast.success(payload.message);
      // Invalidate notes query to refetch notes
      queryClient.invalidateQueries({ queryKey: ["notes"] });

      router.push(`/notes/${payload.data.id}`);
    },
    onError: (error) => {
      toast.error(error.message);

      noteActions.setError(error);
    },
    onSettled: () => {
      toast.dismiss("loadingToast");
      noteActions.setCreating(false);
    },
  });
}
