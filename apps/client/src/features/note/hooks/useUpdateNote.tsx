"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type React from "react";
import toast from "react-hot-toast";

import { useModal } from "@/context/useModal";
import { updateNote } from "../services";

import type { NoteAction } from "@/features/note/types/note.types";

export function useUpdateNote(dispatch: React.Dispatch<NoteAction>) {
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

      toast.dismiss("loadingToast");

      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success(payload.message);

      dispatch({
        type: "UPDATE_NOTE_SUCCESS",
        payload: { note: payload.data, success: true },
      });

      closeModal();

      router.push("/notes");
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
