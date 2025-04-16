"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteNote } from "../services";

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNote,
    onMutate: () => {
      toast.loading("Deleting note...", { id: "loadingToast" });
    },
    onSuccess: (response) => {
      const { payload } = response;

      toast.dismiss("loadingToast");

      queryClient.invalidateQueries({ queryKey: ["notes"] });

      toast.success(payload.message);
    },
    onError: (error) => {
      toast.dismiss("loadingToast");

      toast.error(error.message);
    },
  });
}
