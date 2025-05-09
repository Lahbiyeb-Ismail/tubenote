"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { Dispatch } from "react";
import toast from "react-hot-toast";

import { useModal } from "@/context";

import { updateNote } from "../services";
import type { NoteAction } from "../types";

export function useUpdateNote(dispatch: Dispatch<NoteAction>) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { closeModal } = useModal();

  return useMutation({
    mutationFn: updateNote,
    onMutate: () => {
      toast.loading("Updating note...", { id: "loadingToast" });
    },
    onSuccess: (response) => {
      const { payload } = response;
      const noteId = payload.data.id;

      toast.dismiss("loadingToast");
      toast.success(payload.message);

      queryClient.invalidateQueries({
        queryKey: ["note", noteId],
      });

      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });

      dispatch({
        type: "UPDATE_NOTE_SUCCESS",
        payload: { note: payload.data, success: true },
      });

      closeModal();

      router.push(`/notes/${noteId}`);
    },
    onError: (error) => {
      toast.dismiss("loadingToast");
      toast.error(error.message);

      dispatch({
        type: "UPDATE_NOTE_FAIL",
        payload: {
          message: error.message,
          success: false,
        },
      });
    },
  });
}
