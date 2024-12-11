"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { createNote } from "@/actions/note.actions";
import { useModal } from "@/context/useModal";

import type { TypedError } from "@/types";
import type { NoteAction } from "@/types/note.types";

function useCreateNote(dispatch: React.Dispatch<NoteAction>) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { closeModal } = useModal();

  return useMutation({
    mutationFn: createNote,
    onMutate: () => {
      // Show a loading toast
      toast.loading("Saving note...", { id: "loadingToast" });
    },
    onSuccess: (data) => {
      // Dismiss loading toast
      toast.dismiss("loadingToast");
      // Show success toast
      toast.success(data.message);
      // Invalidate notes query to refetch notes
      queryClient.invalidateQueries({ queryKey: ["notes"] });

      dispatch({
        type: "CREATE_NOTE_SUCCESS",
        payload: { message: data.message, note: data.note, success: true },
      });

      closeModal();

      router.push("/notes");
    },
    onError: (error: TypedError) => {
      // Dismiss loading toast
      toast.dismiss("loadingToast");

      if (error.response) {
        toast.error(error.response.data.message);
        dispatch({
          type: "CREATE_NOTE_FAIL",
          payload: { message: error.response.data.message, success: false },
        });
      } else {
        toast.error("Note Creating Failed. Please try again.");
        dispatch({
          type: "CREATE_NOTE_FAIL",
          payload: {
            message: "Note Creating Failed. Please try again.",
            success: false,
          },
        });
      }
    },
  });
}

export default useCreateNote;
