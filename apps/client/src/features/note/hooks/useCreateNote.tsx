"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useModal } from "@/context/useModal";
import { createNote } from "../services";

import type { NoteAction } from "@/features/note/types/note.types";

export function useCreateNote(dispatch: React.Dispatch<NoteAction>) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { closeModal } = useModal();

  return useMutation({
    mutationFn: createNote,
    onMutate: () => {
      // Show a loading toast
      toast.loading("Saving note...", { id: "loadingToast" });
    },
    onSuccess: (response) => {
      const { payload } = response;

      // Dismiss loading toast
      toast.dismiss("loadingToast");
      // Show success toast
      toast.success(payload.message);
      // Invalidate notes query to refetch notes
      queryClient.invalidateQueries({ queryKey: ["notes"] });

      dispatch({
        type: "CREATE_NOTE_SUCCESS",
        payload: {
          message: payload.message,
          note: payload.data,
          success: true,
        },
      });

      closeModal();

      router.push("/notes");
    },
    onError: (error) => {
      // Dismiss loading toast
      toast.dismiss("loadingToast");

      toast.error(error.message);
      dispatch({
        type: "CREATE_NOTE_FAIL",
        payload: { message: error.message, success: false },
      });
    },
  });
}
