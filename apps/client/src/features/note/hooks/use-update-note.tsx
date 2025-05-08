"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type React from "react";
import toast from "react-hot-toast";

import { useModal } from "@/context";

import { updateNote } from "../services";
import type { NoteAction } from "../types";

export function useUpdateNote(dispatch: React.Dispatch<NoteAction>) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { closeModal } = useModal();

  return useMutation({
    mutationKey: ["update-note"],
    mutationFn: updateNote,
    onMutate: () => {
      toast.loading("Updating note...", { id: "loadingToast" });
    },
    onSuccess: (response) => {
      const { payload } = response;

      toast.dismiss("loadingToast");
      toast.success(payload.message);

      dispatch({
        type: "UPDATE_NOTE_SUCCESS",
        payload: { note: payload.data, success: true },
      });

      queryClient.invalidateQueries({
        queryKey: ["update-note", "notes"],
      });

      closeModal();

      router.push(`/notes/${payload.data.id}`);
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
